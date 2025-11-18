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
        // Para POST, validar que se retornó codigo_remision (snake_case)
        const respuestaData = response.body.data || response.body;
        const codigo = respuestaData.codigo_remision || response.body.data?.codigo_remision;
        expect(codigo).toBeTruthy();
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
        // Validar que el códigoRemisión coincida
        const codigoRemision = responseConsultar.body?.data?.codigoRemision || responseConsultar.body?.codigoRemision;
        expect(codigoRemision).toBe(guiaId);
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

        // La respuesta puede venir en responseConsultar.body.data o directamente
        const guia = responseConsultar.body.data || responseConsultar.body;

        // En la respuesta del GET, los campos vienen en formato plano (no anidados)
        expect(guia.nombreRemitente).toContain('José');
        expect(guia.nombreRemitente).toContain('Núñez');
        expect(guia.nombreRemitente).toContain("O'Connor");
        expect(guia.nombreDestinatario).toContain('María');
        expect(guia.nombreDestinatario).toContain('Ángeles');
    });
});

