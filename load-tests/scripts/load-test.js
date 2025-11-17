import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { config } from './config.js';

/**
 * Prueba de Carga Sostenida
 * 
 * Configuración:
 * - 20 usuarios virtuales simultáneos
 * - 2 solicitudes/segundo por usuario
 * - Duración: 1 minuto
 * - Total esperado: ~100 solicitudes
 * 
 * Objetivo: Validar comportamiento bajo carga normal esperada
 */

// Métricas personalizadas
const errorRate = new Rate('errors');
const getGuiaTrend = new Trend('get_guia_duration');
const successCounter = new Counter('successful_requests');

// Opciones de la prueba
export const options = {
  stages: [
    { duration: '10s', target: 20 },  // Ramp-up: 0 a 20 usuarios en 10s
    { duration: '40s', target: 20 },  // Stay: 20 usuarios por 40s
    { duration: '10s', target: 0 },   // Ramp-down: 20 a 0 usuarios en 10s
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'], // 95% bajo 500ms
    'http_req_failed': ['rate<0.01'],  // Menos del 1% de fallos
    'errors': ['rate<0.01'],           // Tasa de error < 1%
    'get_guia_duration': ['p(95)<800'], // GET debe ser más rápido
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// Variable global para almacenar el token
let bearerToken = null;

// Setup: Obtener token de autenticación
export function setup() {
  console.log('🔐 Obteniendo token de autenticación...');
  
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
    return { token: null };
  }
}

// Función principal de prueba
export default function (data) {
  if (!data.token) {
    console.error('❌ No hay token disponible, abortando prueba');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // GET: Consultar guía
  const guiaId = config.testGuiaId;
  const getResponse = http.get(
    `${config.baseUrl}/guias/${guiaId}`,
    { headers: headers }
  );

  // Registrar métricas
  getGuiaTrend.add(getResponse.timings.duration);

  // Validaciones
  const success = check(getResponse, {
    'Status es 200 o 404': (r) => [200, 404].includes(r.status),
    'Tiempo de respuesta < 1s': (r) => r.timings.duration < 1000,
    'Response tiene body': (r) => r.body && r.body.length > 0,
  });

  if (success) {
    successCounter.add(1);
  } else {
    errorRate.add(1);
    console.error(`❌ Request falló: Status ${getResponse.status}`);
  }

  // Simular tiempo de espera entre requests (2 req/s = 0.5s de espera)
  sleep(0.5);
}

// Teardown: Mostrar resumen
export function teardown(data) {
  console.log('\n📊 Prueba de carga completada');
  console.log('Revisar métricas detalladas en el reporte');
}

