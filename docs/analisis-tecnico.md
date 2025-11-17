# Análisis Técnico - Sistema de Guías con RCE

## 1. Resumen Ejecutivo

Este documento contiene el análisis técnico completo del sistema de generación y consulta de guías logísticas con servicio de Recaudo Contra Entrega (RCE) de Coordinadora.

**Fecha:** Noviembre 2025  
**Autor:** Johan Parra  
**Versión:** 1.0

---

## 2. Endpoints Identificados

### 2.1 Crear Guía (POST)

**URL:** `https://guias-service-test.coordinadora.com/guias`  
**Método:** POST  
**Autenticación:** Bearer Token (OAuth 2.0)  
**Content-Type:** application/json

### 2.2 Consultar Guía (GET)

**URL:** `https://guias-service-test.coordinadora.com/guias/{id}`  
**Método:** GET  
**Autenticación:** Bearer Token (OAuth 2.0)  
**Parámetro:** ID de guía (ejemplo: 99021909297)

---

## 3. Estructura del Payload POST

### 3.1 Campos Obligatorios

Basado en el análisis del reto técnico, los siguientes campos son **obligatorios**:

| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `referencia_recaudo` | string | Referencia única del recaudo | Longitud limitada (definir límite) |
| `valor_recaudo` | number | Monto a recaudar | $1 - $16,000,000 |
| `remitente` | object | Datos del remitente | Objeto completo |
| `remitente.nombre` | string | Nombre del remitente | Caracteres alfanuméricos + especiales |
| `remitente.direccion` | string | Dirección del remitente | Texto |
| `remitente.ciudad` | string | Ciudad del remitente | Texto |
| `remitente.telefono` | string | Teléfono del remitente | Numérico |
| `destinatario` | object | Datos del destinatario | Objeto completo |
| `destinatario.nombre` | string | Nombre del destinatario | Caracteres alfanuméricos + especiales |
| `destinatario.direccion` | string | Dirección del destinatario | Texto |
| `destinatario.ciudad` | string | Ciudad del destinatario | Texto |
| `destinatario.telefono` | string | Teléfono del destinatario | Numérico |

### 3.2 Campos Opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `observaciones` | string | Notas adicionales |
| `descripcion_contenido` | string | Descripción del paquete |
| `peso` | number | Peso del paquete en kg |
| `dimensiones` | object | Largo, ancho, alto |

### 3.3 Ejemplo de Payload Completo

```json
{
  "referencia_recaudo": "REF-2024-001",
  "valor_recaudo": 50000,
  "remitente": {
    "nombre": "Juan Pérez García",
    "direccion": "Calle 123 #45-67",
    "ciudad": "Bogotá",
    "telefono": "3001234567",
    "email": "juan.perez@example.com"
  },
  "destinatario": {
    "nombre": "María López Rodríguez",
    "direccion": "Carrera 89 #12-34 Apto 501",
    "ciudad": "Medellín",
    "telefono": "3109876543",
    "email": "maria.lopez@example.com"
  },
  "descripcion_contenido": "Documentos importantes",
  "peso": 0.5,
  "observaciones": "Entregar en horario laboral"
}
```

---

## 4. Validaciones Identificadas

### 4.1 Validación de Referencia de Recaudo

**Regla:** La longitud del campo `referencia_recaudo` tiene un límite máximo.

**Comportamiento Esperado:**
- Si excede el límite → HTTP 400 Bad Request
- Mensaje de error específico indicando el problema

**Casos de Prueba:**
- ✅ Referencia válida (dentro del límite)
- ❌ Referencia excediendo límite de caracteres
- ✅ Referencia con caracteres especiales permitidos (@, #, -)

### 4.2 Validación de Valor a Recaudar

**Regla:** El valor debe estar en el rango `$1 - $16,000,000`

**Comportamiento Esperado:**

| Valor | Resultado Esperado | Código HTTP |
|-------|-------------------|-------------|
| $0 o menor | Error | 400 |
| $1 | Éxito | 200/201 |
| $50,000 | Éxito | 200/201 |
| $16,000,000 | Éxito | 200/201 |
| $16,000,001 o mayor | Error | 400 |

**Casos de Prueba:**
- ❌ Valor = $0 → Error
- ✅ Valor = $1 (límite inferior) → Éxito
- ✅ Valor = $16,000,000 (límite superior) → Éxito
- ❌ Valor = $16,000,001 → Error
- ❌ Valor negativo → Error
- ❌ Valor = null → Error

### 4.3 Validación de Campos Obligatorios

**Regla:** Todos los campos obligatorios deben estar presentes.

**Comportamiento Esperado:**
- Campo faltante → HTTP 400 Bad Request
- Mensaje de error específico por cada campo

**Casos de Prueba:**
- ❌ Sin `referencia_recaudo` → Error específico
- ❌ Sin `valor_recaudo` → Error específico
- ❌ Sin datos del `remitente` → Error específico
- ❌ Sin datos del `destinatario` → Error específico
- ❌ Objeto `remitente` incompleto → Error específico
- ❌ Objeto `destinatario` incompleto → Error específico

### 4.4 Validación de Caracteres Especiales

**Regla:** Evaluar soporte de caracteres especiales en nombres y direcciones.

**Casos de Prueba:**
- ✅ Nombres con Ñ, tildes (á, é, í, ó, ú)
- ✅ Nombres con apóstrofes (O'Connor)
- ✅ Direcciones con símbolos (#, -, /)
- ⚠️ Caracteres especiales en referencia (@, $, %, &)

---

## 5. Estructura de Respuesta

### 5.1 Respuesta Exitosa (POST)

**Código HTTP:** 200 o 201 Created

```json
{
  "id": "99021909297",
  "referencia_recaudo": "REF-2024-001",
  "valor_recaudo": 50000,
  "estado": "creada",
  "fecha_creacion": "2024-11-17T10:30:00Z",
  "remitente": { ... },
  "destinatario": { ... }
}
```

**Campos de Respuesta:**
- `id`: Identificador único de la guía generada
- `estado`: Estado actual de la guía
- `fecha_creacion`: Timestamp de creación
- Resto de campos enviados en el request

### 5.2 Respuesta de Error (POST)

**Código HTTP:** 400 Bad Request

```json
{
  "error": "Bad Request",
  "mensaje": "El campo 'valor_recaudo' debe estar entre $1 y $16,000,000",
  "campo": "valor_recaudo",
  "codigo_error": "VALIDACION_RANGO"
}
```

### 5.3 Respuesta Exitosa (GET)

**Código HTTP:** 200 OK

```json
{
  "id": "99021909297",
  "referencia_recaudo": "REF-2024-001",
  "valor_recaudo": 50000,
  "estado": "creada",
  "fecha_creacion": "2024-11-17T10:30:00Z",
  "remitente": { ... },
  "destinatario": { ... },
  "tracking": [
    {
      "estado": "creada",
      "fecha": "2024-11-17T10:30:00Z"
    }
  ]
}
```

### 5.4 Respuesta de Error (GET)

**Código HTTP:** 404 Not Found

```json
{
  "error": "Not Found",
  "mensaje": "No se encontró una guía con el ID especificado",
  "codigo_error": "GUIA_NO_ENCONTRADA"
}
```

---

## 6. Autenticación OAuth 2.0

### 6.1 Flujo de Autenticación

**Tipo:** OAuth 2.0 con OpenID Connect  
**Grant Type:** Client Credentials

**Endpoint de Token:** (Por confirmar)

**Request:**
```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

### 6.2 Uso del Token

**Header de Autorización:**
```
Authorization: Bearer {access_token}
```

**Consideraciones:**
- Token expira en 3600 segundos (1 hora)
- Implementar lógica de renovación automática
- Almacenar token en variable de ambiente durante pruebas
- Validar que todos los endpoints requieren autenticación

---

## 7. Casos de Prueba Base Identificados

### CP-001: Solicitud con Datos Válidos
**Entrada:** Payload completo con todos los campos válidos  
**Resultado Esperado:** HTTP 200/201, guía creada correctamente  
**Verificación:** GET devuelve los mismos datos

### CP-002: Campo Referencia Excede Límite
**Entrada:** `referencia_recaudo` con más caracteres del límite  
**Resultado Esperado:** HTTP 400, mensaje de error específico

### CP-003: Valor Fuera de Rango (Menor)
**Entrada:** `valor_recaudo` = $0  
**Resultado Esperado:** HTTP 400, error de rango

### CP-004: Valor Fuera de Rango (Mayor)
**Entrada:** `valor_recaudo` = $16,000,001  
**Resultado Esperado:** HTTP 400, error de rango

### CP-005: Campos Obligatorios Vacíos
**Entrada:** Payload sin campos obligatorios  
**Resultado Esperado:** HTTP 400, error por campo específico

### CP-006: Valores en Límite Inferior
**Entrada:** `valor_recaudo` = $1  
**Resultado Esperado:** HTTP 200/201, aceptado y guardado

### CP-007: Valores en Límite Superior
**Entrada:** `valor_recaudo` = $16,000,000  
**Resultado Esperado:** HTTP 200/201, aceptado y guardado

---

## 8. Análisis de Partición de Equivalencia

### 8.1 Campo: valor_recaudo

| Partición | Rango | Clase | Resultado Esperado |
|-----------|-------|-------|-------------------|
| Inválida | x ≤ 0 | Inválida | Error 400 |
| Válida | 1 ≤ x ≤ 16,000,000 | Válida | Éxito 200 |
| Inválida | x > 16,000,000 | Inválida | Error 400 |

**Valores de Prueba Seleccionados:**
- -1000 (inválido)
- 0 (inválido)
- 1 (límite inferior válido)
- 8,000,000 (medio del rango válido)
- 16,000,000 (límite superior válido)
- 16,000,001 (inválido)

### 8.2 Campo: referencia_recaudo

| Partición | Condición | Resultado Esperado |
|-----------|-----------|-------------------|
| Vacío | string.length = 0 | Error 400 |
| Válido | 1 ≤ length ≤ MAX | Éxito 200 |
| Inválido | length > MAX | Error 400 |

### 8.3 Campo: nombre (remitente/destinatario)

| Partición | Tipo | Resultado Esperado |
|-----------|------|-------------------|
| Vacío | "" | Error 400 |
| Solo letras | "Juan Perez" | Éxito 200 |
| Con tildes | "José María" | Éxito 200 |
| Con Ñ | "Nuñez" | Éxito 200 |
| Con números | "Test123" | ¿Verificar? |
| Con símbolos | "Test@#$" | ¿Verificar? |

---

## 9. Análisis de Valores Límite

### 9.1 Tabla de Valores Límite para valor_recaudo

| Valor | Tipo | Resultado Esperado |
|-------|------|-------------------|
| $0 | Justo debajo del mínimo | Error 400 |
| $1 | Límite inferior exacto | Éxito 200 |
| $2 | Justo arriba del mínimo | Éxito 200 |
| $15,999,999 | Justo debajo del máximo | Éxito 200 |
| $16,000,000 | Límite superior exacto | Éxito 200 |
| $16,000,001 | Justo arriba del máximo | Error 400 |

---

## 10. Tabla de Decisiones

### 10.1 Matriz de Decisión para Creación de Guía

| Condición | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|-----------|----|----|----|----|----|----|----|----|
| referencia_recaudo válida | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| valor_recaudo en rango | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ |
| remitente completo | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| destinatario completo | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| **Resultado** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **HTTP Code** | 200 | 400 | 400 | 400 | 400 | 400 | 400 | 400 |

**Leyenda:**
- ✓ = Condición cumplida / Éxito
- ✗ = Condición no cumplida / Error
- C1 = Caso exitoso (todas las condiciones válidas)
- C2-C8 = Casos de error (al menos una condición inválida)

---

## 11. Transición de Estados

### 11.1 Diagrama de Estados

```
[Inicio] 
   ↓
[Validación de Datos]
   ↓
[Datos Válidos?]
   ├─ NO → [Error 400] → [Fin]
   └─ SÍ → [Autenticación Válida?]
             ├─ NO → [Error 401] → [Fin]
             └─ SÍ → [Crear Guía]
                       ↓
                    [Guardar en BD]
                       ↓
                    [Generar ID]
                       ↓
                    [Respuesta 200/201]
                       ↓
                    [Guía Creada]
                       ↓
                    [Fin]
```

### 11.2 Estados de la Guía

1. **Creada:** Guía recién generada
2. **En Tránsito:** Guía en proceso de entrega (fuera del alcance actual)
3. **Entregada:** Guía entregada exitosamente (fuera del alcance actual)

---

## 12. Consideraciones Técnicas

### 12.1 Tiempos de Respuesta Esperados

| Operación | Tiempo Esperado | Threshold Crítico |
|-----------|----------------|-------------------|
| POST /guias | < 500ms | < 1000ms |
| GET /guias/{id} | < 300ms | < 800ms |
| Token OAuth | < 200ms | < 500ms |

### 12.2 Códigos de Error HTTP

| Código | Descripción | Cuándo Ocurre |
|--------|-------------|---------------|
| 200 | OK | GET exitoso |
| 201 | Created | POST exitoso |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido/expirado |
| 404 | Not Found | Guía no existe |
| 500 | Server Error | Error interno del servidor |

### 12.3 Rate Limiting

**Nota:** Verificar durante pruebas manuales si existe:
- Límite de requests por minuto
- Límite de requests por hora
- Comportamiento ante exceso (HTTP 429)

---

## 13. Riesgos Identificados

### 13.1 Riesgos Técnicos

1. **Expiración de Token:** Token OAuth expira durante pruebas largas
   - **Mitigación:** Implementar renovación automática

2. **Límites No Documentados:** Longitud máxima de referencia_recaudo desconocida
   - **Mitigación:** Pruebas exploratorias manuales primero

3. **Caracteres Especiales:** Comportamiento con caracteres especiales no claro
   - **Mitigación:** Testing exhaustivo en fase manual

4. **Concurrencia:** Comportamiento con referencias duplicadas
   - **Mitigación:** Casos de prueba específicos

### 13.2 Riesgos de Pruebas

1. **Datos de Prueba:** Posible contaminación de base de datos de test
   - **Mitigación:** Usar prefijos únicos en referencias

2. **Dependencias:** Dependencia de ambiente de test disponible
   - **Mitigación:** Manejo de errores de conectividad

---

## 14. Próximos Pasos

### 14.1 Fase 1 (Actual)
- ✅ Análisis de requisitos completado
- ⏳ Configuración de autenticación
- ⏳ Validación inicial de endpoints

### 14.2 Fase 2
- Documentación de historia de usuario
- Creación de matriz de casos de prueba
- Escritura de escenarios BDD

### 14.3 Fase 3
- Pruebas manuales con Postman
- Validación de comportamientos
- Documentación de hallazgos

---

## 15. Referencias

- Documento del Reto Técnico: `Reto Técnico Automatizador.pdf`
- Endpoints de Prueba:
  - POST: https://guias-service-test.coordinadora.com/guias
  - GET: https://guias-service-test.coordinadora.com/guias/99021909297

---

**Documento Vivo:** Este análisis se actualizará conforme se descubra nueva información durante las pruebas manuales y automatizadas.

