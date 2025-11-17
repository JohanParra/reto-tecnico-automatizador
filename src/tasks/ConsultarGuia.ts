import { Get } from '../interactions/Get';

/**
 * Task: ConsultarGuia
 * Tarea de alto nivel para consultar una guía por ID
 */
export class ConsultarGuia {
  private guiaId: string;
  private response: any;

  constructor(guiaId: string) {
    this.guiaId = guiaId;
  }

  /**
   * Factory method para crear la tarea
   */
  static porId(guiaId: string): ConsultarGuia {
    return new ConsultarGuia(guiaId);
  }

  /**
   * Ejecuta la tarea de consultar guía
   */
  async ejecutar(): Promise<any> {
    console.log(`🔍 Consultando guía con ID: ${this.guiaId}`);
    
    this.response = await Get.from(`/guias/${this.guiaId}`);
    
    if (this.response.status === 200) {
      console.log(`✓ Guía encontrada: ${this.response.body.referencia_recaudo || 'N/A'}`);
    } else {
      console.log(`✗ Error al consultar guía: ${this.response.status}`);
    }
    
    return this.response;
  }

  /**
   * Obtiene la respuesta de la última ejecución
   */
  obtenerRespuesta(): any {
    return this.response;
  }
}

export default ConsultarGuia;

