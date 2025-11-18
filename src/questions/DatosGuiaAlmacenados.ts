import { GuiaPayload } from '../helpers/payload.builder';

/**
 * Question: DatosGuiaAlmacenados
 * Verifica que los datos de una guía se hayan almacenado correctamente
 */
export class DatosGuiaAlmacenados {
    /**
     * Compara los datos enviados vs los retornados por GET
     */
    static coincidenCon(responseGet: any, payloadOriginal: GuiaPayload): boolean {
        if (!responseGet.body) return false;

        // La respuesta puede venir en responseGet.body.data o directamente en responseGet.body
        const guia = responseGet.body.data || responseGet.body;

        // Validar campos críticos
        // Nota: En la respuesta del GET, los campos vienen en formato plano (no anidados)
        const validaciones = [
            guia.referenciaRecaudo === payloadOriginal.referenciaRecaudo,
            String(guia.valorRecaudar) === payloadOriginal.valorRecaudar,
            guia.nombreRemitente === payloadOriginal.datosRemitente.nombreRemitente,
            guia.ciudadRemitente === payloadOriginal.datosRemitente.codigoCiudadRemitente,
            guia.nombreDestinatario === payloadOriginal.datosDestinatario.nombreDestinatario,
            guia.ciudadDestinatario === payloadOriginal.datosDestinatario.codigoCiudadDestinatario
        ];

        return validaciones.every(v => v === true);
    }

    /**
     * Verifica que un campo específico coincida
     */
    static campoCoincide(responseGet: any, nombreCampo: string, valorEsperado: any): boolean {
        if (!responseGet.body) return false;

        // Manejo de campos anidados (ej: "remitente.nombre")
        const partes = nombreCampo.split('.');
        let valor = responseGet.body;

        for (const parte of partes) {
            if (valor && typeof valor === 'object') {
                valor = valor[parte];
            } else {
                return false;
            }
        }

        return valor === valorEsperado;
    }

    /**
     * Verifica que la guía tenga un ID válido
     * Para POST: busca en data.codigo_remision (snake_case)
     * Para GET: busca en data.codigoRemision (camelCase)
     */
    static tieneIdValido(response: any): boolean {
        if (!response.body) return false;

        // Para respuestas GET, usar codigoRemision (camelCase)
        if (response.body.data?.codigoRemision) {
            return typeof response.body.data.codigoRemision === 'string' &&
                response.body.data.codigoRemision.length > 0;
        }

        // Para respuestas POST, usar codigo_remision (snake_case)
        const codigoRemision = response.body.data?.codigo_remision;
        return codigoRemision &&
            typeof codigoRemision === 'string' &&
            codigoRemision.length > 0;
    }

    /**
     * Verifica que la guía tenga timestamp de creación
     */
    static tieneFechaCreacion(response: any): boolean {
        return response.body &&
            (response.body.fecha_creacion || response.body.created_at);
    }

    /**
     * Verifica que la guía tenga un estado
     */
    static tieneEstado(response: any): boolean {
        return response.body && response.body.estado;
    }

    /**
     * Extrae el ID de la guía
     * Para POST: busca en data.codigo_remision (snake_case)
     * Para GET: busca en data.codigoRemision (camelCase)
     */
    static obtenerID(response: any): string {
        if (!response.body?.data) return '';

        // Para respuestas GET, usar codigoRemision (camelCase)
        if (response.body.data.codigoRemision) {
            return response.body.data.codigoRemision;
        }

        // Para respuestas POST, usar codigo_remision (snake_case)
        return response.body.data.codigo_remision || '';
    }
}

export default DatosGuiaAlmacenados;

