import dotenv from 'dotenv';

dotenv.config();

export const config = {
    auth: {
        url: process.env.AUTH_URL || '',
        clientId: process.env.CLIENT_ID || '',
        clientSecret: process.env.CLIENT_SECRET || '',
        grantType: process.env.GRANT_TYPE || 'client_credentials',
        scope: process.env.SCOPE || 'openid'
    },
    api: {
        baseUrl: process.env.API_BASE_URL || 'https://guias-service-test.coordinadora.com',
        timeout: parseInt(process.env.API_TIMEOUT || '30000', 10)
    },
    test: {
        guiaId: process.env.TEST_GUIA_ID || '99021909297'
    }
};

export default config;

