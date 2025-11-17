import { Post } from '../interactions/Post';
import { GuiaPayload } from '../helpers/payload.builder';

/**
 * Task: CrearGuia
 * Tarea de alto nivel para crear una guía
 */
export class CrearGuia {
  private payload: GuiaPayload;
  private response: any;

  constructor(payload: GuiaPayload) {
    this.payload = payload;
  }

  /**
   * Factory method para crear la tarea
   */
  static conDatos(payload: GuiaPayload): CrearGuia {
    return new CrearGuia(payload);
  }

  /**
   * Ejecuta la tarea de crear guía
   */
  async ejecutar(): Promise<any> {
    console.log(`📝 Creando guía con referencia: ${this.payload.referencia_recaudo}`);
    
    this.response = await Post.to('/guias', this.payload);
    
    if (this.response.status === 200 || this.response.status === 201) {
      console.log(`✓ Guía creada exitosamente con ID: ${this.response.body.id}`);
    } else {
      console.log(`✗ Error al crear guía: ${this.response.status}`);
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

export default CrearGuia;

