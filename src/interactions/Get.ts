import { request } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';
import config from '../config/config';

/**
 * Interaction: Get
 * Realiza una llamada GET HTTP al endpoint especificado
 */
export class Get {
  /**
   * Envía una solicitud GET al endpoint especificado
   */
  static async from(endpoint: string): Promise<any> {
    const context = await request.newContext();
    const headers = await AuthHelper.getAuthHeaders();

    try {
      const response = await context.get(`${config.api.baseUrl}${endpoint}`, {
        headers
      });

      const body = await response.body();
      let jsonResponse;
      
      try {
        jsonResponse = JSON.parse(body.toString());
      } catch {
        jsonResponse = { raw: body.toString() };
      }

      await context.dispose();

      return {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        body: jsonResponse
      };
    } catch (error) {
      await context.dispose();
      throw error;
    }
  }
}

export default Get;

