# Reporte de Pruebas Manuales

## Información General

**Fecha de Ejecución:** [PENDIENTE]  
**Ejecutado por:** Johan Parra  
**Herramienta:** Postman  
**Ambiente:** Test (https://guias-service-test.coordinadora.com)  
**Colección:** Coordinadora - Guías RCE

---

## Instrucciones de Ejecución

1. Importar colección: `docs/postman/Coordinadora-Guias-RCE.postman_collection.json`
2. Importar environment: `docs/postman/Coordinadora-Test.postman_environment.json`
3. Configurar credenciales OAuth en el environment
4. Ejecutar carpeta "0. Autenticación" para obtener token
5. Ejecutar el resto de carpetas secuencialmente
6. Capturar screenshots de casos relevantes
7. Documentar resultados en este archivo

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Total de pruebas | [PENDIENTE] |
| Pruebas exitosas (PASS) | [PENDIENTE] |
| Pruebas fallidas (FAIL) | [PENDIENTE] |
| Tasa de éxito | [PENDIENTE]% |
| Tiempo total de ejecución | [PENDIENTE] min |

---

## Resultados por Categoría

### 1. Casos Exitosos

#### CP-001: Crear guía con datos válidos
- **Estado:** ⏳ PENDIENTE
- **Request:** POST /guias
- **Código HTTP:** -
- **Tiempo Respuesta:** -ms
- **ID Generado:** -
- **Observaciones:** -
- **Screenshot:** -

#### CP-002: Consultar guía creada
- **Estado:** ⏳ PENDIENTE  
- **Request:** GET /guias/{id}
- **Código HTTP:** -
- **Tiempo Respuesta:** -ms
- **Observaciones:** -
- **Screenshot:** -

#### CP-003: Guía con caracteres especiales
- **Estado:** ⏳ PENDIENTE
- **Caracteres probados:** Ñ, tildes (á, é, í, ó, ú), apóstrofes
- **Código HTTP:** -
- **Observaciones:** -

---

### 2. Valores Límite

#### CP-004: Valor mínimo ($1)
- **Estado:** ⏳ PENDIENTE
- **Valor probado:** $1
- **Código HTTP:** -
- **Resultado:** -
- **Observaciones:** -

#### CP-005: Valor máximo ($16,000,000)
- **Estado:** ⏳ PENDIENTE
- **Valor probado:** $16,000,000
- **Código HTTP:** -
- **Resultado:** -
- **Observaciones:** -

#### CP-006: Valor = $0 (debe fallar)
- **Estado:** ⏳ PENDIENTE
- **Valor probado:** $0
- **Código HTTP Esperado:** 400
- **Código HTTP Real:** -
- **Mensaje de Error:** -
- **Observaciones:** -

#### CP-007: Valor > $16M (debe fallar)
- **Estado:** ⏳ PENDIENTE
- **Valor probado:** $16,000,001
- **Código HTTP Esperado:** 400
- **Código HTTP Real:** -
- **Mensaje de Error:** -
- **Observaciones:** -

---

### 3. Campos Obligatorios

#### CP-008: Sin referencia_recaudo
- **Estado:** ⏳ PENDIENTE
- **Código HTTP Esperado:** 400
- **Código HTTP Real:** -
- **Mensaje de Error:** -
- **Observaciones:** -

#### CP-009: Sin valor_recaudo
- **Estado:** ⏳ PENDIENTE
- **Código HTTP Esperado:** 400
- **Código HTTP Real:** -
- **Mensaje de Error:** -

#### CP-010: Sin remitente
- **Estado:** ⏳ PENDIENTE
- **Código HTTP Esperado:** 400
- **Código HTTP Real:** -
- **Mensaje de Error:** -

#### CP-011: Sin destinatario
- **Estado:** ⏳ PENDIENTE
- **Código HTTP Esperado:** 400
- **Código HTTP Real:** -
- **Mensaje de Error:** -

---

### 4. Manejo de Errores

#### CP-012: ID inexistente (404)
- **Estado:** ⏳ PENDIENTE
- **ID probado:** 99999999999
- **Código HTTP Esperado:** 404
- **Código HTTP Real:** -
- **Mensaje de Error:** -

#### CP-013: Referencia excede límite
- **Estado:** ⏳ PENDIENTE
- **Longitud probada:** 500+ caracteres
- **Código HTTP Esperado:** 400
- **Código HTTP Real:** -
- **Mensaje de Error:** -

---

## Hallazgos y Observaciones

### Comportamientos Esperados Confirmados
1. [PENDIENTE]
2. [PENDIENTE]

### Discrepancias Encontradas
1. [PENDIENTE]
2. [PENDIENTE]

### Bugs Identificados
1. [PENDIENTE]
2. [PENDIENTE]

---

## Tiempos de Respuesta

| Endpoint | Promedio | Mínimo | Máximo | p95 |
|----------|----------|--------|--------|-----|
| POST /guias | -ms | -ms | -ms | -ms |
| GET /guias/{id} | -ms | -ms | -ms | -ms |

---

## Conclusiones

[PENDIENTE - Completar después de ejecutar las pruebas]

---

## Recomendaciones

1. [PENDIENTE]
2. [PENDIENTE]
3. [PENDIENTE]

---

## Anexos

### Screenshots
- [Adjuntar screenshots de casos relevantes]

### Logs de Errores
```
[PENDIENTE - Adjuntar logs si aplica]
```

