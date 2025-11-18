import { request } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';
import config from '../config/config';

/**
 * Interaction: Post
 * Realiza una llamada POST HTTP al endpoint especificado
 */
export class Post {
    /**
     * Envía una solicitud POST con el payload especificado
     */
    static async to(endpoint: string, payload: any): Promise<any> {
        const context = await request.newContext();
        const headers = await AuthHelper.getAuthHeaders();

        try {
            const response = await context.post(`${config.api.baseUrl}${endpoint}`, {
                headers,
                data: payload
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

export default Post;

