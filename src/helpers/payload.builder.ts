/**
 * PayloadBuilder - Constructor de payloads para el API de guías
 * Proporciona métodos para crear payloads válidos y casos de prueba
 */

export interface DetalleGuia {
    pesoReal: number;
    largo: number;
    ancho: number;
    alto: number;
    unidades: number;
    ubl: number;
    referencia: string;
}

export interface DatosRemitente {
    detalleRemitente: string;
    tipoViaRemitente: string;
    viaRemitente: string;
    numeroRemitente: string;
    codigoCiudadRemitente: string;
    descripcionTipoViaRemitente: string;
    direccionRemitente: string;
    nombreRemitente: string;
    indicativoRemitente: string;
    celularRemitente: string;
    correoRemitente: string;
}

export interface DatosDestinatario {
    detalleDestinatario: string;
    tipoViaDestinatario: string;
    viaDestinatario: string;
    numeroDestinatario: string;
    descripcionTipoViaDestinatario: string;
    direccionDestinatario: string;
    codigoCiudadDestinatario: string;
    nombreDestinatario: string;
    indicativoDestinatario: string;
    celularDestinatario: string;
    correoDestinatario: string;
}

export interface GuiaPayload {
    identificacion: string;
    divisionCliente: string;
    idProceso: number;
    codigoPais: number;
    valoracion: string;
    tipoCuenta: number;
    contenido: string;
    codigoProducto: number;
    nivelServicio: number;
    detalle: DetalleGuia[];
    datosRemitente: DatosRemitente;
    datosDestinatario: DatosDestinatario;
    valorRecaudar: string;
    referenciaRecaudo: string;
    tipoGuia: number;
    referenciaGuia: string;
    usuario: string;
    fuente: string;
    observaciones?: string;
}

export class PayloadBuilder {
    /**
     * Crea un payload válido con datos por defecto
     */
    static crearPayloadValido(overrides?: Partial<GuiaPayload>): GuiaPayload {
        const timestamp = Date.now();
        const defaultPayload: GuiaPayload = {
            identificacion: "890904713",
            divisionCliente: "00",
            idProceso: 100001,
            codigoPais: 170,
            valoracion: "200000",
            tipoCuenta: 3,
            contenido: "reloj",
            codigoProducto: 1,
            nivelServicio: 22,
            detalle: [
                {
                    pesoReal: 1,
                    largo: 5,
                    ancho: 5,
                    alto: 3,
                    unidades: 1,
                    ubl: 0,
                    referencia: "ref detalle"
                }
            ],
            datosRemitente: {
                detalleRemitente: "Casa",
                tipoViaRemitente: "7",
                viaRemitente: "15",
                numeroRemitente: "53 48",
                codigoCiudadRemitente: "76001000",
                descripcionTipoViaRemitente: "Calle",
                direccionRemitente: "Calle 53 # 53 48",
                nombreRemitente: "Juan Pérez García",
                indicativoRemitente: "57",
                celularRemitente: "3001234567",
                correoRemitente: "usuario@test.com"
            },
            datosDestinatario: {
                detalleDestinatario: "Casa",
                tipoViaDestinatario: "5",
                viaDestinatario: "15",
                numeroDestinatario: "45 93",
                descripcionTipoViaDestinatario: "Calle",
                direccionDestinatario: "calle 45 93",
                codigoCiudadDestinatario: "76001000",
                nombreDestinatario: "María López Rodríguez",
                indicativoDestinatario: "57",
                celularDestinatario: "3109876543",
                correoDestinatario: "destinatario@test.com"
            },
            valorRecaudar: "38500",
            referenciaRecaudo: `Ref guia ${timestamp}`,
            tipoGuia: 1,
            referenciaGuia: `Ref guia ${timestamp}`,
            usuario: "usuarioprueba@mail.com",
            fuente: "envios",
            observaciones: "Prueba automatizada - No procesar"
        };

        return { ...defaultPayload, ...overrides };
    }

    /**
     * Crea un payload con valor en el límite inferior ($1)
     */
    static crearPayloadLimiteInferior(): GuiaPayload {
        return this.crearPayloadValido({
            referenciaRecaudo: `REF-LIMITE-INF-${Date.now()}`,
            referenciaGuia: `REF-LIMITE-INF-${Date.now()}`,
            valorRecaudar: "1"
        });
    }

    /**
     * Crea un payload con valor en el límite superior ($16,000,000)
     */
    static crearPayloadLimiteSuperior(): GuiaPayload {
        return this.crearPayloadValido({
            referenciaRecaudo: `REF-LIMITE-SUP-${Date.now()}`,
            referenciaGuia: `REF-LIMITE-SUP-${Date.now()}`,
            valorRecaudar: "16000000"
        });
    }

    /**
     * Crea un payload con valor menor al mínimo permitido
     */
    static crearPayloadValorMenorMinimo(): GuiaPayload {
        return this.crearPayloadValido({
            referenciaRecaudo: `REF-INVALID-MIN-${Date.now()}`,
            referenciaGuia: `REF-INVALID-MIN-${Date.now()}`,
            valorRecaudar: "0"
        });
    }

    /**
     * Crea un payload con valor mayor al máximo permitido
     */
    static crearPayloadValorMayorMaximo(): GuiaPayload {
        return this.crearPayloadValido({
            referenciaRecaudo: `REF-INVALID-MAX-${Date.now()}`,
            referenciaGuia: `REF-INVALID-MAX-${Date.now()}`,
            valorRecaudar: "16000001"
        });
    }

    /**
     * Crea un payload con referencia de recaudo excesivamente larga
     */
    static crearPayloadReferenciaExcedeLimite(): GuiaPayload {
        const referenciaLarga = 'REF-' + 'X'.repeat(500); // 500+ caracteres
        return this.crearPayloadValido({
            referenciaRecaudo: referenciaLarga,
            referenciaGuia: referenciaLarga
        });
    }

    /**
     * Crea un payload con caracteres especiales en nombres
     */
    static crearPayloadConCaracteresEspeciales(): GuiaPayload {
        return this.crearPayloadValido({
            referenciaRecaudo: `REF-CHARS-${Date.now()}`,
            referenciaGuia: `REF-CHARS-${Date.now()}`,
            datosRemitente: {
                ...this.crearPayloadValido().datosRemitente,
                nombreRemitente: "José María Núñez O'Connor"
            },
            datosDestinatario: {
                ...this.crearPayloadValido().datosDestinatario,
                nombreDestinatario: "María Ángeles Rodríguez"
            }
        });
    }

    /**
     * Crea un payload sin campos opcionales
     */
    static crearPayloadSinCamposOpcionales(): GuiaPayload {
        const payload = this.crearPayloadValido();
        delete payload.observaciones;
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
            datosRemitente: {
                nombreRemitente: "Juan Pérez"
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
            datosDestinatario: {
                nombreDestinatario: "María López"
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
