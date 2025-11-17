/**
 * PayloadBuilder - Constructor de payloads para el API de guías
 * Proporciona métodos para crear payloads válidos y casos de prueba
 */

export interface Remitente {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email?: string;
}

export interface Destinatario {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email?: string;
}

export interface GuiaPayload {
  referencia_recaudo: string;
  valor_recaudo: number;
  remitente: Remitente;
  destinatario: Destinatario;
  descripcion_contenido?: string;
  peso?: number;
  observaciones?: string;
}

export class PayloadBuilder {
  /**
   * Crea un payload válido con datos por defecto
   */
  static crearPayloadValido(overrides?: Partial<GuiaPayload>): GuiaPayload {
    const timestamp = Date.now();
    const defaultPayload: GuiaPayload = {
      referencia_recaudo: `REF-TEST-${timestamp}`,
      valor_recaudo: 50000,
      remitente: {
        nombre: 'Juan Pérez García',
        direccion: 'Calle 123 #45-67',
        ciudad: 'Bogotá',
        telefono: '3001234567',
        email: 'juan.perez@test.com'
      },
      destinatario: {
        nombre: 'María López Rodríguez',
        direccion: 'Carrera 89 #12-34 Apto 501',
        ciudad: 'Medellín',
        telefono: '3109876543',
        email: 'maria.lopez@test.com'
      },
      descripcion_contenido: 'Documentos de prueba automatizada',
      peso: 0.5,
      observaciones: 'Prueba automatizada - No procesar'
    };

    return { ...defaultPayload, ...overrides };
  }

  /**
   * Crea un payload con valor en el límite inferior ($1)
   */
  static crearPayloadLimiteInferior(): GuiaPayload {
    return this.crearPayloadValido({
      referencia_recaudo: `REF-LIMITE-INF-${Date.now()}`,
      valor_recaudo: 1
    });
  }

  /**
   * Crea un payload con valor en el límite superior ($16,000,000)
   */
  static crearPayloadLimiteSuperior(): GuiaPayload {
    return this.crearPayloadValido({
      referencia_recaudo: `REF-LIMITE-SUP-${Date.now()}`,
      valor_recaudo: 16000000
    });
  }

  /**
   * Crea un payload con valor menor al mínimo permitido
   */
  static crearPayloadValorMenorMinimo(): GuiaPayload {
    return this.crearPayloadValido({
      referencia_recaudo: `REF-INVALID-MIN-${Date.now()}`,
      valor_recaudo: 0
    });
  }

  /**
   * Crea un payload con valor mayor al máximo permitido
   */
  static crearPayloadValorMayorMaximo(): GuiaPayload {
    return this.crearPayloadValido({
      referencia_recaudo: `REF-INVALID-MAX-${Date.now()}`,
      valor_recaudo: 16000001
    });
  }

  /**
   * Crea un payload con referencia de recaudo excesivamente larga
   */
  static crearPayloadReferenciaExcedeLimite(): GuiaPayload {
    const referenciaLarga = 'REF-' + 'X'.repeat(500); // 500+ caracteres
    return this.crearPayloadValido({
      referencia_recaudo: referenciaLarga
    });
  }

  /**
   * Crea un payload con caracteres especiales en nombres
   */
  static crearPayloadConCaracteresEspeciales(): GuiaPayload {
    return this.crearPayloadValido({
      referencia_recaudo: `REF-CHARS-${Date.now()}`,
      remitente: {
        nombre: 'José María Nuñez O\'Connor',
        direccion: 'Calle 123 #45-67',
        ciudad: 'Bogotá',
        telefono: '3001234567',
        email: 'jose.nunez@test.com'
      },
      destinatario: {
        nombre: 'María Ángeles Rodríguez',
        direccion: 'Carrera 89 #12-34',
        ciudad: 'Medellín',
        telefono: '3109876543',
        email: 'maria.angeles@test.com'
      }
    });
  }

  /**
   * Crea un payload sin campos opcionales
   */
  static crearPayloadSinCamposOpcionales(): GuiaPayload {
    const payload = this.crearPayloadValido();
    delete payload.descripcion_contenido;
    delete payload.peso;
    delete payload.observaciones;
    delete payload.remitente.email;
    delete payload.destinatario.email;
    return payload;
  }

  /**
   * Crea un payload sin un campo obligatorio específico
   */
  static crearPayloadSinCampo(campo: keyof GuiaPayload): Partial<GuiaPayload> {
    const payload = this.crearPayloadValido();
    const payloadParcial: any = { ...payload };
    delete payloadParcial[campo];
    return payloadParcial;
  }

  /**
   * Crea un payload con remitente incompleto
   */
  static crearPayloadRemitenteIncompleto(): any {
    const payload = this.crearPayloadValido();
    return {
      ...payload,
      remitente: {
        nombre: 'Juan Pérez'
        // Faltan otros campos obligatorios
      }
    };
  }

  /**
   * Crea un payload con destinatario incompleto
   */
  static crearPayloadDestinatarioIncompleto(): any {
    const payload = this.crearPayloadValido();
    return {
      ...payload,
      destinatario: {
        nombre: 'María López'
        // Faltan otros campos obligatorios
      }
    };
  }

  /**
   * Genera una referencia única para pruebas
   */
  static generarReferenciaUnica(prefijo: string = 'REF'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefijo}-${timestamp}-${random}`;
  }
}

export default PayloadBuilder;

