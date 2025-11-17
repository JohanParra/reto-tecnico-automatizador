import { test, expect } from '@playwright/test';
import { CrearGuia } from '../../src/tasks/CrearGuia';
import { ConsultarGuia } from '../../src/tasks/ConsultarGuia';
import { PayloadBuilder } from '../../src/helpers/payload.builder';
import { RespuestaHTTP } from '../../src/questions/RespuestaHTTP';
import { DatosGuiaAlmacenados } from '../../src/questions/DatosGuiaAlmacenados';

test.describe('Casos Exitosos - Creación de Guías', () => {
  
  test('CP-001: Debe crear guía con todos los datos válidos', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadValido();
    const tarea = CrearGuia.conDatos(payload);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.esExitosa(response)).toBeTruthy();
    expect(RespuestaHTTP.codigoEstaEntre(response, [200, 201])).toBeTruthy();
    expect(DatosGuiaAlmacenados.tieneIdValido(response)).toBeTruthy();
    expect(response.body.referencia_recaudo).toBe(payload.referencia_recaudo);
    expect(response.body.valor_recaudo).toBe(payload.valor_recaudo);
  });

  test('CP-002: Debe consultar guía previamente creada y retornar los mismos datos', async () => {
    // Arrange - Crear guía primero
    const payload = PayloadBuilder.crearPayloadValido();
    const tareaCrear = CrearGuia.conDatos(payload);
    const responseCrear = await tareaCrear.ejecutar();
    const guiaId = DatosGuiaAlmacenados.obtenerID(responseCrear);

    // Act - Consultar la guía creada
    const tareaConsultar = ConsultarGuia.porId(guiaId);
    const responseConsultar = await tareaConsultar.ejecutar();

    // Assert
    expect(RespuestaHTTP.codigoEs(responseConsultar, 200)).toBeTruthy();
    expect(DatosGuiaAlmacenados.coincidenCon(responseConsultar, payload)).toBeTruthy();
    expect(responseConsultar.body.id).toBe(guiaId);
  });

  test('CP-003: Debe crear guía con solo campos obligatorios (sin opcionales)', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadSinCamposOpcionales();
    const tarea = CrearGuia.conDatos(payload);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.esExitosa(response)).toBeTruthy();
    expect(DatosGuiaAlmacenados.tieneIdValido(response)).toBeTruthy();
  });

  test('CP-004: Debe aceptar caracteres especiales en nombres (Ñ, tildes, apóstrofes)', async () => {
    // Arrange
    const payload = PayloadBuilder.crearPayloadConCaracteresEspeciales();
    const tarea = CrearGuia.conDatos(payload);

    // Act
    const response = await tarea.ejecutar();

    // Assert
    expect(RespuestaHTTP.esExitosa(response)).toBeTruthy();
    
    // Verificar que los caracteres se preservaron
    const guiaId = DatosGuiaAlmacenados.obtenerID(response);
    const tareaConsultar = ConsultarGuia.porId(guiaId);
    const responseConsultar = await tareaConsultar.ejecutar();
    
    expect(responseConsultar.body.remitente.nombre).toContain('José');
    expect(responseConsultar.body.remitente.nombre).toContain('Núñez');
    expect(responseConsultar.body.remitente.nombre).toContain("O'Connor");
  });
});

