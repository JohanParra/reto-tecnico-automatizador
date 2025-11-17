import { test, expect } from '@playwright/test';
import { CrearGuia } from '../../src/tasks/CrearGuia';
import { PayloadBuilder } from '../../src/helpers/payload.builder';
import { RespuestaHTTP } from '../../src/questions/RespuestaHTTP';
import { MensajeError } from '../../src/questions/MensajeError';

test.describe('Validación de Campos Obligatorios', () => {
  
  test('CP-011: Debe rechazar guía sin referencia_recaudo', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadSinCampo('referencia_recaudo');
    const tarea = CrearGuia.conDatos(payload as any);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    expect(MensajeError.existe(response)).toBeTruthy();
    expect(MensajeError.mencionaCampo(response, 'referencia')).toBeTruthy();
  });

  test('CP-012: Debe rechazar guía sin valor_recaudo', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadSinCampo('valor_recaudo');
    const tarea = CrearGuia.conDatos(payload as any);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    expect(MensajeError.existe(response)).toBeTruthy();
    expect(MensajeError.mencionaCampo(response, 'valor')).toBeTruthy();
  });

  test('CP-013: Debe rechazar guía sin remitente', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadSinCampo('remitente');
    const tarea = CrearGuia.conDatos(payload as any);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    expect(MensajeError.existe(response)).toBeTruthy();
    expect(MensajeError.mencionaCampo(response, 'remitente')).toBeTruthy();
  });

  test('CP-014: Debe rechazar guía sin destinatario', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadSinCampo('destinatario');
    const tarea = CrearGuia.conDatos(payload as any);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    expect(MensajeError.existe(response)).toBeTruthy();
    expect(MensajeError.mencionaCampo(response, 'destinatario')).toBeTruthy();
  });

  test('CP-015: Debe rechazar guía con remitente incompleto', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadRemitenteIncompleto();
    const tarea = CrearGuia.conDatos(payload);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    expect(MensajeError.existe(response)).toBeTruthy();
  });

  test('CP-016: Debe rechazar guía con destinatario incompleto', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadDestinatarioIncompleto();
    const tarea = CrearGuia.conDatos(payload);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    expect(MensajeError.existe(response)).toBeTruthy();
  });

  test('CP-017: Debe rechazar referencia_recaudo vacía', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadValido({ referencia_recaudo: '' });
    const tarea = CrearGuia.conDatos(payload);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(response, 400)).toBeTruthy();
    expect(MensajeError.existe(response)).toBeTruthy();
  });
});

