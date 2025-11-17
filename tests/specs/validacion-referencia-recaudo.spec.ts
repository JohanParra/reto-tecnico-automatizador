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
    expect(MensajeError.existe(response)).toBeTruthy();
    // Verificar que el mensaje menciona algo sobre longitud o límite
    const mensaje = MensajeError.obtener(response);
    expect(
      mensaje.toLowerCase().includes('límite') || 
      mensaje.toLowerCase().includes('longitud') ||
      mensaje.toLowerCase().includes('caracteres') ||
      mensaje.toLowerCase().includes('largo')
    ).toBeTruthy();
  });

  test('CP-019: Debe aceptar referencia con caracteres alfanuméricos y guiones', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadValido({
      referencia_recaudo: 'REF-2024-TEST-001'
    });
    const tarea = CrearGuia.conDatos(payload);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.esExitosa(response)).toBeTruthy();
  });
});

