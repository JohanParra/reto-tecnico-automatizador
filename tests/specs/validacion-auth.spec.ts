import { test, expect } from '@playwright/test';
import { AuthHelper } from '../../src/helpers/auth.helper';
import config from '../../src/config/config';

test.describe('Validación de Autenticación OAuth 2.0', () => {
  
  test('Debe obtener un token de autenticación válido', async () => {
    console.log('\n🔐 Iniciando validación de autenticación...');
    console.log(`📍 URL: ${config.auth.url}`);
    console.log(`👤 Client ID: ${config.auth.clientId}`);
    console.log(`🔑 Scope: ${config.auth.scope}\n`);

    // Act
    const token = await AuthHelper.getBearerToken();

    // Assert
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    
    console.log(`✅ Token obtenido exitosamente`);
    console.log(`📝 Token (primeros 20 caracteres): ${token.substring(0, 20)}...`);
  });

  test('Debe reutilizar el token si aún es válido', async () => {
    // Obtener primer token
    const token1 = await AuthHelper.getBearerToken();
    expect(token1).toBeTruthy();

    // Obtener segundo token (debe ser el mismo)
    const token2 = await AuthHelper.getBearerToken();
    expect(token2).toBe(token1);
    
    console.log('✅ Token reutilizado correctamente (no se solicitó uno nuevo)');
  });

  test('Debe verificar que el token es válido', async () => {
    // Obtener token
    await AuthHelper.getBearerToken();
    
    // Verificar que tiene un token válido
    const tieneToken = AuthHelper.hasValidToken();
    expect(tieneToken).toBe(true);
    
    console.log('✅ Token marcado como válido');
  });

  test('Debe obtener headers de autenticación correctos', async () => {
    // Act
    const headers = await AuthHelper.getAuthHeaders();

    // Assert
    expect(headers).toHaveProperty('Authorization');
    expect(headers.Authorization).toMatch(/^Bearer .+/);
    expect(headers).toHaveProperty('Content-Type', 'application/json');
    expect(headers).toHaveProperty('Accept', 'application/json');
    
    console.log('✅ Headers de autenticación generados correctamente');
    console.log(`📋 Authorization header: ${headers.Authorization.substring(0, 30)}...`);
  });

  test('Debe invalidar y renovar el token cuando se solicite', async () => {
    // Obtener token inicial
    const token1 = await AuthHelper.getBearerToken();
    
    // Invalidar token
    AuthHelper.invalidateToken();
    const tieneToken = AuthHelper.hasValidToken();
    expect(tieneToken).toBe(false);
    
    // Obtener nuevo token
    const token2 = await AuthHelper.getBearerToken();
    expect(token2).toBeTruthy();
    
    console.log('✅ Token invalidado y renovado correctamente');
  });
});

