import { request } from '@playwright/test';
import { AuthHelper } from './auth.helper';
import config from '../config/config';

/**
 * ValidationHelper - Valida disponibilidad y rendimiento de endpoints
 */
export class ValidationHelper {
  
  /**
   * Valida la disponibilidad de un endpoint
   */
  static async validarEndpoint(url: string, method: 'GET' | 'POST' = 'GET'): Promise<{
    disponible: boolean;
    tiempoRespuesta: number;
    statusCode: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const context = await request.newContext();
      const headers = await AuthHelper.getAuthHeaders();
      
      let response;
      if (method === 'GET') {
        response = await context.get(url, { headers });
      } else {
        // Para POST, usar payload de prueba mínimo
        response = await context.post(url, {
          headers,
          data: {}
        });
      }
      
      const endTime = Date.now();
      const tiempoRespuesta = endTime - startTime;
      
      await context.dispose();
      
      return {
        disponible: response.ok() || response.status() === 400 || response.status() === 404,
        tiempoRespuesta,
        statusCode: response.status()
      };
      
    } catch (error) {
      const endTime = Date.now();
      return {
        disponible: false,
        tiempoRespuesta: endTime - startTime,
        statusCode: 0,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Mide el tiempo de respuesta promedio de un endpoint
   */
  static async medirTiempoPromedio(
    url: string, 
    intentos: number = 3
  ): Promise<{
    promedio: number;
    minimo: number;
    maximo: number;
    mediciones: number[];
  }> {
    const mediciones: number[] = [];
    
    for (let i = 0; i < intentos; i++) {
      const resultado = await this.validarEndpoint(url);
      mediciones.push(resultado.tiempoRespuesta);
      
      // Pequeña pausa entre mediciones
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const promedio = mediciones.reduce((a, b) => a + b, 0) / mediciones.length;
    const minimo = Math.min(...mediciones);
    const maximo = Math.max(...mediciones);
    
    return { promedio, minimo, maximo, mediciones };
  }

  /**
   * Valida todos los endpoints del sistema
   */
  static async validarTodosLosEndpoints(): Promise<void> {
    console.log('\n=== VALIDACIÓN DE ENDPOINTS ===\n');
    
    // Endpoint POST
    console.log('1. POST /guias');
    const postUrl = `${config.api.baseUrl}/guias`;
    const postResult = await this.validarEndpoint(postUrl, 'POST');
    console.log(`   Disponible: ${postResult.disponible ? '✓' : '✗'}`);
    console.log(`   Status: ${postResult.statusCode}`);
    console.log(`   Tiempo: ${postResult.tiempoRespuesta}ms`);
    if (postResult.error) {
      console.log(`   Error: ${postResult.error}`);
    }
    
    // Endpoint GET
    console.log('\n2. GET /guias/{id}');
    const getUrl = `${config.api.baseUrl}/guias/${config.test.guiaId}`;
    const getResult = await this.validarEndpoint(getUrl, 'GET');
    console.log(`   Disponible: ${getResult.disponible ? '✓' : '✗'}`);
    console.log(`   Status: ${getResult.statusCode}`);
    console.log(`   Tiempo: ${getResult.tiempoRespuesta}ms`);
    if (getResult.error) {
      console.log(`   Error: ${getResult.error}`);
    }
    
    // Medir tiempos promedio
    console.log('\n3. Medición de rendimiento (3 intentos)');
    const tiemposGet = await this.medirTiempoPromedio(getUrl);
    console.log(`   GET /guias/{id}:`);
    console.log(`     Promedio: ${tiemposGet.promedio.toFixed(2)}ms`);
    console.log(`     Mínimo: ${tiemposGet.minimo}ms`);
    console.log(`     Máximo: ${tiemposGet.maximo}ms`);
    
    console.log('\n=== FIN DE VALIDACIÓN ===\n');
  }
}

export default ValidationHelper;

