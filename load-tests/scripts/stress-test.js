import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { config } from './config.js';

/**
 * Prueba de Estrés Incremental
 * 
 * Configuración:
 * - Usuarios iniciales: 100
 * - Incremento: +50 cada 15 segundos
 * - Duración total: 1 minuto
 * - Objetivo: Identificar punto de falla del sistema
 * 
 * Progresión:
 * 0-15s: 100 usuarios
 * 15-30s: 150 usuarios
 * 30-45s: 200 usuarios
 * 45-60s: 250 usuarios
 */

// Métricas personalizadas
const errorRate = new Rate('errors');
const getGuiaTrend = new Trend('get_guia_duration');
const successCounter = new Counter('successful_requests');
const failureCounter = new Counter('failed_requests');

// Opciones de la prueba - Incremento gradual
export const options = {
  stages: [
    { duration: '15s', target: 100 },  // Inicio: 100 usuarios
    { duration: '15s', target: 150 },  // +50 usuarios
    { duration: '15s', target: 200 },  // +50 usuarios
    { duration: '15s', target: 250 },  // +50 usuarios (pico)
    { duration: '10s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'], // Más permisivo que load test
    'http_req_failed': ['rate<0.05'],  // Permitir hasta 5% de fallos
    'errors': ['rate<0.05'],
    'get_guia_duration': ['p(95)<1500'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// Setup: Obtener token de autenticación
export function setup() {
  console.log('🔐 Obteniendo token de autenticación para prueba de estrés...');
  
  // Validar que las variables de entorno estén configuradas
  if (!config.auth.url || !config.auth.clientId || !config.auth.clientSecret) {
    console.error('❌ Error: Variables de autenticación no configuradas');
    console.error('   AUTH_URL:', config.auth.url || '❌ NO CONFIGURADO');
    console.error('   CLIENT_ID:', config.auth.clientId || '❌ NO CONFIGURADO');
    console.error('   CLIENT_SECRET:', config.auth.clientSecret ? '***' : '❌ NO CONFIGURADO');
    console.error('\n💡 Asegúrate de tener un archivo .env en la raíz del proyecto con estas variables.');
    return { token: null };
  }
  
  const authPayload = {
    grant_type: config.auth.grantType,
    client_id: config.auth.clientId,
    client_secret: config.auth.clientSecret,
  };

  const authResponse = http.post(
    config.auth.url,
    authPayload,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  if (authResponse.status === 200) {
    const token = JSON.parse(authResponse.body).access_token;
    console.log('✓ Token obtenido exitosamente');
    return { token: token };
  } else {
    console.error('✗ Error al obtener token:', authResponse.status);
    console.error('   Respuesta:', authResponse.body);
    return { token: null };
  }
}

// Función principal de prueba
export default function (data) {
  if (!data.token) {
    console.error('❌ No hay token disponible, abortando prueba');
    failureCounter.add(1);
    return;
  }

  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // GET: Consultar guía
  const guiaId = config.testGuiaId;
  const startTime = Date.now();
  
  const getResponse = http.get(
    `${config.baseUrl}/guias/${guiaId}`,
    { 
      headers: headers,
      timeout: '30s', // Timeout más largo para estrés
    }
  );

  const duration = Date.now() - startTime;
  getGuiaTrend.add(duration);

  // Validaciones
  const checks = {
    'Status es 200, 404 o 5xx': (r) => [200, 404, 500, 502, 503, 504].includes(r.status),
    'Response tiene body o es error conocido': (r) => r.body || r.status >= 500,
    'No timeout': (r) => r.timings.duration < 30000,
  };

  const success = check(getResponse, checks);

  if (success && [200, 404].includes(getResponse.status)) {
    successCounter.add(1);
  } else {
    errorRate.add(1);
    failureCounter.add(1);
    
    // Logging detallado de errores
    if (getResponse.status >= 500) {
      console.error(`⚠️ Error de servidor: ${getResponse.status} - ${getResponse.status_text}`);
    } else if (getResponse.status === 429) {
      console.warn(`⏳ Rate limit alcanzado: ${getResponse.status}`);
    } else if (getResponse.status >= 400) {
      console.error(`❌ Error de cliente: ${getResponse.status}`);
    }
  }

  // Tiempo de espera adaptativo según carga
  const vus = __VU;
  const sleepTime = vus < 150 ? 0.3 : (vus < 200 ? 0.2 : 0.1);
  sleep(sleepTime);
}

// Teardown: Análisis de resultados
export function teardown(data) {
  console.log('\n📊 Prueba de estrés completada');
  console.log('💡 Analizar métricas para identificar:');
  console.log('   - Punto de degradación de rendimiento');
  console.log('   - Límite de usuarios concurrentes');
  console.log('   - Tasa de errores en diferentes niveles de carga');
  console.log('   - Cuellos de botella del sistema');
}

