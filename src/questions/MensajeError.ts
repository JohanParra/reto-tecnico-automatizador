/**
 * Question: MensajeError
 * Verifica mensajes de error en respuestas de API
 */
export class MensajeError {
    /**
     * Verifica si la respuesta contiene un mensaje de error
     */
    static existe(response: any): boolean {
        return response.body && (
            response.body.isError === true ||
            response.body.error ||
            response.body.mensaje ||
            response.body.message ||
            response.body.errors
        );
    }

    /**
     * Obtiene el mensaje de error de la respuesta
     */
    static obtener(response: any): string {
        if (!response.body) return '';

        // Si tiene estructura de error con cause, incluir ambos
        if (response.body.cause) {
            return `${response.body.message || ''} - ${response.body.cause}`;
        }

        return response.body.mensaje ||
            response.body.message ||
            response.body.error ||
            JSON.stringify(response.body.errors || '');
    }

    /**
     * Obtiene el código de error
     */
    static obtenerCodigo(response: any): string {
        return response.body?.code || '';
    }

    /**
     * Obtiene la causa del error (campo específico que falló)
     */
    static obtenerCausa(response: any): string {
        return response.body?.cause || '';
    }

    /**
     * Verifica si el mensaje contiene un texto específico
     */
    static contiene(response: any, textoEsperado: string): boolean {
        const mensaje = this.obtener(response).toLowerCase();
        return mensaje.includes(textoEsperado.toLowerCase());
    }

    /**
     * Verifica si el mensaje menciona un campo específico
     */
    static mencionaCampo(response: any, nombreCampo: string): boolean {
        const mensaje = this.obtener(response).toLowerCase();
        const campo = nombreCampo.toLowerCase();
        return mensaje.includes(campo);
    }

    /**
     * Verifica si hay errores de validación
     */
    static esErrorValidacion(response: any): boolean {
        const mensaje = this.obtener(response).toLowerCase();
        return mensaje.includes('validación') ||
            mensaje.includes('validation') ||
            mensaje.includes('obligatorio') ||
            mensaje.includes('required') ||
            mensaje.includes('inválido') ||
            mensaje.includes('invalid');
    }
}

export default MensajeError;

