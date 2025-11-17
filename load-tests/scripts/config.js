/**
 * Configuración compartida para pruebas de carga y estrés con k6
 */

export const config = {
  // URL base de la API
  baseUrl: __ENV.API_BASE_URL || 'https://guias-service-test.coordinadora.com',
  
  // Configuración de autenticación OAuth
  auth: {
    url: __ENV.AUTH_URL || '',
    clientId: __ENV.CLIENT_ID || '',
    clientSecret: __ENV.CLIENT_SECRET || '',
    grantType: 'client_credentials'
  },
  
  // ID de guía de prueba
  testGuiaId: __ENV.TEST_GUIA_ID || '99021909297',
  
  // Thresholds por defecto
  thresholds: {
    // Tiempo de respuesta
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% bajo 500ms, 99% bajo 1s
    
    // Tasa de éxito
    http_req_failed: ['rate<0.01'], // Menos del 1% de fallos
    
    // Requests por segundo
    http_reqs: ['rate>10'], // Al menos 10 req/s
  }
};

export default config;

