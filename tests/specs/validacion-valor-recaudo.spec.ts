import { test, expect } from '@playwright/test';
import { CrearGuia } from '../../src/tasks/CrearGuia';
import { PayloadBuilder } from '../../src/helpers/payload.builder';
import { RespuestaHTTP } from '../../src/questions/RespuestaHTTP';
import { MensajeError } from '../../src/questions/MensajeError';
import { DatosGuiaAlmacenados } from '../../src/questions/DatosGuiaAlmacenados';

test.describe('Validación de Valor a Recaudar', () => {

    test('CP-005: Debe aceptar valor mínimo permitido ($1)', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadLimiteInferior();
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.esExitosa(response)).toBeTruthy();
        expect(DatosGuiaAlmacenados.tieneIdValido(response)).toBeTruthy();
        // Para POST, validar que se retornó codigo_remision (snake_case)
        const respuestaData = response.body.data || response.body;
        const codigo = respuestaData.codigo_remision || response.body.data?.codigo_remision;
        expect(codigo).toBeTruthy();
    });

    test('CP-006: Debe aceptar valor máximo permitido ($16,000,000)', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadLimiteSuperior();
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.esExitosa(response)).toBeTruthy();
        expect(DatosGuiaAlmacenados.tieneIdValido(response)).toBeTruthy();
        // Para POST, validar que se retornó codigo_remision (snake_case)
        const respuestaData = response.body.data || response.body;
        const codigo = respuestaData.codigo_remision || response.body.data?.codigo_remision;
        expect(codigo).toBeTruthy();
    });

    test('CP-007: Debe rechazar valor igual a cero', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadValorMenorMinimo();
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
        expect(MensajeError.existe(response)).toBeTruthy();
        expect(RespuestaHTTP.esErrorCliente(response)).toBeTruthy();
    });

    test('CP-008: Debe rechazar valor mayor al máximo ($16,000,001)', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadValorMayorMaximo();
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
        expect(MensajeError.existe(response)).toBeTruthy();
    });

    test('CP-009: Debe rechazar valor negativo', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadValido({ valorRecaudar: "-1000" });
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
        expect(MensajeError.existe(response)).toBeTruthy();
    });

    test.describe('Pruebas con múltiples valores fuera de rango', () => {
        const valoresInvalidos = [
            { valor: -5000, descripcion: 'negativo grande' },
            { valor: -1, descripcion: 'negativo mínimo' },
            { valor: 0, descripcion: 'cero' },
            { valor: 20000000, descripcion: 'muy por encima del máximo' },
            { valor: 16000001, descripcion: 'justo arriba del máximo' }
        ];

        valoresInvalidos.forEach(({ valor, descripcion }) => {
            test(`CP-010-${descripcion}: Debe rechazar valor ${valor}`, async () => {
                // Arrange
                const payload = PayloadBuilder.crearPayloadValido({ valorRecaudar: String(valor) });
                const tarea = CrearGuia.conDatos(payload);

                // Act
                const response = await tarea.ejecutar();

                // Assert
                expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
                expect(MensajeError.existe(response)).toBeTruthy();
            });
        });
    });
});

