import { test, expect } from '@playwright/test';
import { CrearGuia } from '../../src/tasks/CrearGuia';
import { PayloadBuilder } from '../../src/helpers/payload.builder';
import { RespuestaHTTP } from '../../src/questions/RespuestaHTTP';

test.describe('Validación de Campos Obligatorios', () => {

    test('CP-011: Debe rechazar guía sin referenciaRecaudo', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadSinCampo('referenciaRecaudo');
        const tarea = CrearGuia.conDatos(payload as any);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    });

    test('CP-012: Debe rechazar guía sin valorRecaudar', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadSinCampo('valorRecaudar');
        const tarea = CrearGuia.conDatos(payload as any);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    });

    test('CP-013: Debe rechazar guía sin datosRemitente', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadSinCampo('datosRemitente');
        const tarea = CrearGuia.conDatos(payload as any);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    });

    test('CP-014: Debe rechazar guía sin datosDestinatario', async () => {
        // Arrange
        // Nota: El payload real no incluye destinatario, este test puede no aplicarse
        const payload = PayloadBuilder.crearPayloadSinCampo('datosDestinatario' as any);
        const tarea = CrearGuia.conDatos(payload as any);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    });

    test('CP-015: Debe rechazar guía con remitente incompleto', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadRemitenteIncompleto();
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    });

    test('CP-016: Debe rechazar guía con destinatario incompleto', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadDestinatarioIncompleto();
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    });

    test('CP-017: Debe rechazar referenciaRecaudo vacía', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadValido({ referenciaRecaudo: '' });
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    });
});

