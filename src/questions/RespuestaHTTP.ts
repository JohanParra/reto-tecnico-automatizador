/**
 * Question: RespuestaHTTP
 * Verifica el código de estado HTTP de una respuesta
 */
export class RespuestaHTTP {
    /**
     * Verifica si el código de estado es el esperado
     */
    static codigoEs(response: any, codigoEsperado: number): boolean {
        return response.status === codigoEsperado;
    }

    /**
     * Verifica si el código de estado está en un rango de códigos válidos
     */
    static codigoEstaEntre(response: any, codigos: number[]): boolean {
        return codigos.includes(response.status);
    }

    /**
     * Verifica si la respuesta es exitosa (2xx)
     */
    static esExitosa(response: any): boolean {
        return response.status >= 200 && response.status < 300;
    }

    /**
     * Verifica si la respuesta es un error de cliente (4xx)
     */
    static esErrorCliente(response: any): boolean {
        return response.status >= 400 && response.status < 500;
    }

    /**
     * Verifica si la respuesta es un error de servidor (5xx)
     */
    static esErrorServidor(response: any): boolean {
        return response.status >= 500 && response.status < 600;
    }

    /**
     * Obtiene el código de estado
     */
    static obtenerCodigo(response: any): number {
        return response.status;
    }
}

export default RespuestaHTTP;

