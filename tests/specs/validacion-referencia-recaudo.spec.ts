import { test, expect } from '@playwright/test';
import { CrearGuia } from '../../src/tasks/CrearGuia';
import { PayloadBuilder } from '../../src/helpers/payload.builder';
import { RespuestaHTTP } from '../../src/questions/RespuestaHTTP';
import { MensajeError } from '../../src/questions/MensajeError';

test.describe('Validación de Referencia de Recaudo', () => {

    test('CP-018: Debe rechazar referencia que excede el límite de caracteres', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadReferenciaExcedeLimite();
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
        expect(response.body.isError).toBe(true);
        expect(response.body.message).toBe("Los valores de entrada no son correctos.");
        expect(response.body.code).toBe("BAD_MESSAGE");
        expect(response.body.statusCode).toBe(400);
        expect(response.body.cause).toContain("referenciaRecaudo");
        expect(response.body.cause).toContain("excede la cantidad de caracteres permitidos");
        expect(response.body.cause).toContain("30");
    });

    test('CP-019: Debe aceptar referencia con caracteres alfanuméricos y guiones', async () => {
        // Arrange
        const payload = PayloadBuilder.crearPayloadValido({
            referenciaRecaudo: 'REF-2024-TEST-001'
        });
        const tarea = CrearGuia.conDatos(payload);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.esExitosa(response)).toBeTruthy();
    });
});

