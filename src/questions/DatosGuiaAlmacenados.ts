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

    const guia = responseGet.body;

    // Validar campos críticos
    const validaciones = [
      guia.referencia_recaudo === payloadOriginal.referencia_recaudo,
      guia.valor_recaudo === payloadOriginal.valor_recaudo,
      guia.remitente?.nombre === payloadOriginal.remitente.nombre,
      guia.remitente?.ciudad === payloadOriginal.remitente.ciudad,
      guia.destinatario?.nombre === payloadOriginal.destinatario.nombre,
      guia.destinatario?.ciudad === payloadOriginal.destinatario.ciudad
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
   */
  static tieneIdValido(response: any): boolean {
    return response.body && 
           response.body.id && 
           typeof response.body.id === 'string' &&
           response.body.id.length > 0;
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
   */
  static obtenerID(response: any): string {
    return response.body?.id || '';
  }
}

export default DatosGuiaAlmacenados;

