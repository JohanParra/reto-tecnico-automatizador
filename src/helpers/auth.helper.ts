import { request } from '@playwright/test';
import config from '../config/config';

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
}

/**
 * AuthHelper - Maneja la autenticación OAuth 2.0
 * Implementa el flujo de Client Credentials para obtener Bearer Token
 */
export class AuthHelper {
    private static token: string | null = null;
    private static tokenExpiry: number = 0;

    /**
     * Obtiene un Bearer Token válido
     * Si el token existe y no ha expirado, lo reutiliza
     * Si no, solicita uno nuevo
     */
    static async getBearerToken(): Promise<string> {
        const now = Date.now();

        // Si el token existe y aún es válido (con 5 min de margen), reutilizarlo
        if (this.token && now < this.tokenExpiry - 300000) {
            console.log('✓ Reutilizando token existente');
            return this.token;
        }

        console.log('⟳ Solicitando nuevo token OAuth 2.0...');
        const newToken = await this.requestNewToken();
        return newToken;
    }

    /**
     * Solicita un nuevo token al servidor de autenticación
     */
    private static async requestNewToken(): Promise<string> {
        try {
            const context = await request.newContext();

            // Preparar el body como form-urlencoded
            const formData = new URLSearchParams({
                grant_type: config.auth.grantType,
                client_id: config.auth.clientId,
                client_secret: config.auth.clientSecret,
                scope: config.auth.scope
            });

            const response = await context.post(config.auth.url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData.toString()
            });

            if (!response.ok()) {
                throw new Error(`Error al obtener token: ${response.status()} ${response.statusText()}`);
            }

            const tokenData: TokenResponse = await response.json();

            // Almacenar token y tiempo de expiración
            this.token = tokenData.access_token;
            this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);

            console.log(`✓ Token obtenido exitosamente (expira en ${tokenData.expires_in}s)`);

            await context.dispose();
            return this.token;

        } catch (error) {
            console.error('✗ Error al obtener token de autenticación:', error);
            throw error;
        }
    }

    /**
     * Obtiene los headers de autorización con el Bearer Token
     */
    static async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await this.getBearerToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Fuerza la renovación del token (útil para testing)
     */
    static invalidateToken(): void {
        console.log('⚠ Token invalidado manualmente');
        this.token = null;
        this.tokenExpiry = 0;
    }

    /**
     * Verifica si hay un token válido actualmente
     */
    static hasValidToken(): boolean {
        const now = Date.now();
        return this.token !== null && now < this.tokenExpiry;
    }
}

export default AuthHelper;

