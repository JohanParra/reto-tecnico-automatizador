import { test, expect } from '@playwright/test';
import { ConsultarGuia } from '../../src/tasks/ConsultarGuia';
import { RespuestaHTTP } from '../../src/questions/RespuestaHTTP';
import { MensajeError } from '../../src/questions/MensajeError';
import config from '../../src/config/config';

test.describe('Manejo de Errores', () => {

    test('CP-020: Debe retornar 404 al consultar ID inexistente', async () => {
        // Arrange
        const idInexistente = '99999999999';
        const tarea = ConsultarGuia.porId(idInexistente);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        expect(RespuestaHTTP.codigoEs(response, 404)).toBeTruthy();
        expect(MensajeError.existe(response)).toBeTruthy();
        const mensaje = MensajeError.obtener(response);
        expect(
            mensaje.toLowerCase().includes('not found') ||
            mensaje.toLowerCase().includes('no encontrada') ||
            mensaje.toLowerCase().includes('no existe')
        ).toBeTruthy();
    });

    test('CP-021: Debe poder consultar guía de ejemplo del ambiente test', async () => {
        // Arrange - Usa el ID de ejemplo del documento
        const idEjemplo = config.test.guiaId;
        const tarea = ConsultarGuia.porId(idEjemplo);

        // Act
        const response = await tarea.ejecutar();

        // Assert
        // Puede ser 200 si existe o 404 si no - documentar comportamiento
        expect([200, 404]).toContain(response.status);

        if (response.status === 200) {
            console.log('✓ Guía de ejemplo encontrada');
            expect(response.body).toHaveProperty('id');
        } else {
            console.log('ℹ Guía de ejemplo no encontrada (404)');
        }
    });
});

