# Validación Inicial de Endpoints

## Fecha de Ejecución
**Fecha:** Noviembre 2025  
**Ambiente:** Test  
**Base URL:** https://guias-service-test.coordinadora.com

---

## 1. Objetivo

Validar la disponibilidad y medir los tiempos de respuesta baseline de los endpoints del sistema de guías con RCE antes de iniciar las pruebas automatizadas.

---

## 2. Endpoints Validados

### 2.1 POST /guias

**URL Completa:** `https://guias-service-test.coordinadora.com/guias`  
**Método:** POST  
**Propósito:** Crear nuevas guías con información de RCE

**Resultado de Validación:**
- Estado: ⏳ Pendiente de ejecutar
- Disponibilidad: -
- Tiempo de respuesta: -
- Notas: -

### 2.2 GET /guias/{id}

**URL Completa:** `https://guias-service-test.coordinadora.com/guias/99021909297`  
**Método:** GET  
**Propósito:** Consultar guía existente por ID

**Resultado de Validación:**
- Estado: ⏳ Pendiente de ejecutar
- Disponibilidad: -
- Tiempo de respuesta: -
- Notas: -

---

## 3. Configuración de Pruebas

### 3.1 Autenticación

- **Tipo:** OAuth 2.0 (OpenID Connect)
- **Grant Type:** Client Credentials
- **Header:** Authorization: Bearer {token}

### 3.2 Headers Estándar

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

---

## 4. Métricas Baseline

### 4.1 Tiempos de Respuesta Objetivo

| Endpoint | Esperado | Aceptable | Crítico |
|----------|----------|-----------|---------|
| POST /guias | < 500ms | < 1000ms | > 1500ms |
| GET /guias/{id} | < 300ms | < 800ms | > 1200ms |

### 4.2 Códigos de Estado Esperados

| Endpoint | Escenario | Código Esperado |
|----------|-----------|-----------------|
| POST | Datos válidos | 200 o 201 |
| POST | Datos inválidos | 400 |
| POST | Sin autenticación | 401 |
| GET | ID existe | 200 |
| GET | ID no existe | 404 |
| GET | Sin autenticación | 401 |

---

## 5. Problemas Identificados

### 5.1 Conectividad

- [ ] Sin problemas de conectividad
- [ ] Latencia alta (> 1000ms)
- [ ] Timeouts intermitentes
- [ ] CORS bloqueando requests
- [ ] Otro: _________________

### 5.2 Autenticación

- [ ] Token se genera correctamente
- [ ] Token expira según lo esperado
- [ ] Headers de autorización aceptados
- [ ] Problema con credenciales
- [ ] Otro: _________________

### 5.3 Disponibilidad

- [ ] Ambos endpoints disponibles
- [ ] POST disponible, GET no
- [ ] GET disponible, POST no
- [ ] Ninguno disponible
- [ ] Intermitencia en disponibilidad

---

## 6. Resultados de Ejecución

### Intento 1 - [Fecha/Hora]

**POST /guias:**
```
Status: -
Tiempo: -ms
Respuesta: -
```

**GET /guias/99021909297:**
```
Status: -
Tiempo: -ms
Respuesta: -
```

### Intento 2 - [Fecha/Hora]

**POST /guias:**
```
Status: -
Tiempo: -ms
Respuesta: -
```

**GET /guias/99021909297:**
```
Status: -
Tiempo: -ms
Respuesta: -
```

### Intento 3 - [Fecha/Hora]

**POST /guias:**
```
Status: -
Tiempo: -ms
Respuesta: -
```

**GET /guias/99021909297:**
```
Status: -
Tiempo: -ms
Respuesta: -
```

---

## 7. Estadísticas Consolidadas

### 7.1 POST /guias

- **Disponibilidad:** -% (- de - intentos exitosos)
- **Tiempo Promedio:** -ms
- **Tiempo Mínimo:** -ms
- **Tiempo Máximo:** -ms
- **Desviación Estándar:** -ms

### 7.2 GET /guias/{id}

- **Disponibilidad:** -% (- de - intentos exitosos)
- **Tiempo Promedio:** -ms
- **Tiempo Mínimo:** -ms
- **Tiempo Máximo:** -ms
- **Desviación Estándar:** -ms

---

## 8. Análisis de Red

### 8.1 Latencia de Red

- Latencia promedio al servidor: -ms
- Pérdida de paquetes: -%
- Jitter: -ms

### 8.2 SSL/TLS

- Versión TLS: -
- Tiempo de handshake: -ms
- Certificado válido: -

---

## 9. Conclusiones

### 9.1 Estado General

🟢 **APTO PARA PRUEBAS** - Todos los endpoints disponibles y respondiendo dentro de los parámetros  
🟡 **APTO CON RESERVAS** - Disponible pero con problemas de rendimiento  
🔴 **NO APTO** - Problemas críticos que impiden las pruebas

**Estado:** ⏳ Pendiente

### 9.2 Observaciones

1. -
2. -
3. -

### 9.3 Recomendaciones

1. -
2. -
3. -

---

## 10. Próximos Pasos

- [ ] Validación inicial completada
- [ ] Proceder con pruebas manuales en Postman (Fase 3)
- [ ] Documentar hallazgos adicionales
- [ ] Actualizar configuración según necesidades identificadas

---

## 11. Comandos de Validación

Para ejecutar la validación inicial:

```bash
# Configurar variables de ambiente primero
cp .env.example .env
# Editar .env con credenciales reales

# Ejecutar validación (cuando esté implementado el script)
npm run validate:endpoints
```

---

**Nota:** Este documento se actualizará con los resultados reales una vez se ejecuten las pruebas de validación.

