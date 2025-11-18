#!/usr/bin/env node

/**
 * Wrapper script para ejecutar k6 con variables de entorno desde .env
 * k6 no carga automáticamente archivos .env, así que este script:
 * 1. Carga las variables desde .env
 * 2. Las pasa a k6 como variables de entorno
 */

const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Obtener el script de k6 a ejecutar
const k6Script = process.argv[2];

if (!k6Script) {
  console.error('❌ Error: Debes especificar el script de k6 a ejecutar');
  console.error('Uso: node run-k6.js <script-k6.js>');
  process.exit(1);
}

// Variables de entorno requeridas
const requiredVars = ['AUTH_URL', 'CLIENT_ID', 'CLIENT_SECRET'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Error: Faltan variables de entorno requeridas:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Asegúrate de tener un archivo .env en la raíz del proyecto con:');
  console.error('   AUTH_URL=...');
  console.error('   CLIENT_ID=...');
  console.error('   CLIENT_SECRET=...');
  process.exit(1);
}

// Preparar variables de entorno para k6
const env = {
  ...process.env,
  // Asegurar que las variables necesarias estén disponibles
  API_BASE_URL: process.env.API_BASE_URL || 'https://guias-service-test.coordinadora.com',
  AUTH_URL: process.env.AUTH_URL,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  TEST_GUIA_ID: process.env.TEST_GUIA_ID || '99021909297',
};

// Ejecutar k6 con las variables de entorno
const k6Process = spawn('k6', ['run', k6Script], {
  env: env,
  stdio: 'inherit',
  shell: true,
});

k6Process.on('error', (error) => {
  console.error('❌ Error al ejecutar k6:', error.message);
  console.error('💡 Asegúrate de tener k6 instalado: brew install k6');
  process.exit(1);
});

k6Process.on('exit', (code) => {
  process.exit(code || 0);
});

