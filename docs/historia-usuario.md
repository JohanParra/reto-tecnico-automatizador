# Historia de Usuario - Sistema de Guías con RCE

## Información General

**ID:** HU-001  
**Título:** Generación y Consulta de Guías con Recaudo Contra Entrega (RCE)  
**Épica:** Sistema de Gestión de Guías Logísticas  
**Prioridad:** Alta  
**Estimación:** 8 Story Points  
**Sprint:** 1

---

## Historia de Usuario

**Como** usuario del sistema de guías logísticas de Coordinadora  
**Quiero** crear y consultar guías con servicio de Recaudo Contra Entrega (RCE)  
**Para** poder gestionar envíos con cobro al destinatario y validar que los datos de recaudo se almacenan correctamente

---

## Criterios de Aceptación

### CA-01: Creación Exitosa de Guía con Datos Válidos

**Dado** que tengo un token de autenticación válido  
**Y** proporciono todos los campos obligatorios correctamente  
**Y** el valor a recaudar está entre $1 y $16,000,000  
**Y** la referencia de recaudo no excede el límite de caracteres  
**Cuando** envío una solicitud POST al endpoint /guias  
**Entonces** el sistema debe responder con código HTTP 200 o 201  
**Y** debe retornar un ID único de guía  
**Y** debe almacenar todos los datos correctamente en la base de datos

---

### CA-02: Consulta de Guía Creada

**Dado** que he creado una guía exitosamente  
**Y** tengo el ID de la guía  
**Y** tengo un token de autenticación válido  
**Cuando** consulto la guía mediante GET /guias/{id}  
**Entonces** el sistema debe responder con código HTTP 200  
**Y** debe retornar exactamente los mismos datos que fueron enviados en la creación  
**Y** debe incluir información adicional como estado y fecha de creación

---

### CA-03: Validación de Valor Mínimo a Recaudar

**Dado** que intento crear una guía  
**Y** el valor a recaudar es menor a $1 (incluyendo $0, negativos o null)  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe responder con código HTTP 400  
**Y** debe retornar un mensaje de error claro indicando que el valor mínimo es $1  
**Y** no debe crear la guía en el sistema

---

### CA-04: Validación de Valor Máximo a Recaudar

**Dado** que intento crear una guía  
**Y** el valor a recaudar es mayor a $16,000,000  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe responder con código HTTP 400  
**Y** debe retornar un mensaje de error claro indicando que el valor máximo es $16,000,000  
**Y** no debe crear la guía en el sistema

---

### CA-05: Aceptación de Valores en Límites Exactos

**Dado** que intento crear una guía  
**Y** el valor a recaudar es exactamente $1 O exactamente $16,000,000  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe aceptar el valor como válido  
**Y** debe responder con código HTTP 200 o 201  
**Y** debe crear la guía exitosamente

---

### CA-06: Validación de Referencia de Recaudo Excesiva

**Dado** que intento crear una guía  
**Y** la referencia de recaudo excede el límite máximo de caracteres permitido  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe responder con código HTTP 400  
**Y** debe retornar un mensaje de error específico sobre el límite de caracteres  
**Y** no debe crear la guía en el sistema

---

### CA-07: Validación de Campos Obligatorios del Remitente

**Dado** que intento crear una guía  
**Y** falta uno o más campos obligatorios del remitente (nombre, dirección, ciudad, teléfono)  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe responder con código HTTP 400  
**Y** debe retornar un mensaje de error indicando qué campo específico falta  
**Y** no debe crear la guía en el sistema

---

### CA-08: Validación de Campos Obligatorios del Destinatario

**Dado** que intento crear una guía  
**Y** falta uno o más campos obligatorios del destinatario (nombre, dirección, ciudad, teléfono)  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe responder con código HTTP 400  
**Y** debe retornar un mensaje de error indicando qué campo específico falta  
**Y** no debe crear la guía en el sistema

---

### CA-09: Validación de Campo Valor a Recaudar Obligatorio

**Dado** que intento crear una guía  
**Y** no incluyo el campo valor_recaudo en el payload  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe responder con código HTTP 400  
**Y** debe retornar un mensaje de error indicando que el campo es obligatorio  
**Y** no debe crear la guía en el sistema

---

### CA-10: Validación de Campo Referencia de Recaudo Obligatorio

**Dado** que intento crear una guía  
**Y** no incluyo el campo referencia_recaudo en el payload  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe responder con código HTTP 400  
**Y** debe retornar un mensaje de error indicando que el campo es obligatorio  
**Y** no debe crear la guía en el sistema

---

### CA-11: Soporte de Caracteres Especiales en Nombres

**Dado** que creo una guía  
**Y** los nombres de remitente o destinatario contienen caracteres especiales válidos (Ñ, tildes, apóstrofes)  
**Cuando** envío la solicitud POST  
**Entonces** el sistema debe aceptar estos caracteres  
**Y** debe crear la guía exitosamente  
**Y** debe almacenar los nombres correctamente preservando los caracteres especiales

---

### CA-12: Campos Opcionales Pueden Omitirse

**Dado** que creo una guía  
**Y** no incluyo campos opcionales (observaciones, descripción_contenido, peso, dimensiones)  
**Cuando** envío la solicitud POST con solo campos obligatorios  
**Entonces** el sistema debe aceptar la solicitud  
**Y** debe crear la guía exitosamente  
**Y** debe responder con código HTTP 200 o 201

---

## Técnicas de Testing Aplicadas

### 1. Partición de Equivalencia

#### Campo: valor_recaudo

| Clase de Equivalencia | Descripción | Valor de Prueba | Resultado Esperado |
|----------------------|-------------|-----------------|-------------------|
| **Inválida - Negativo** | Valores negativos | -1000, -1 | Error 400 |
| **Inválida - Cero** | Valor igual a cero | 0 | Error 400 |
| **Válida - Mínimo** | Límite inferior | 1 | Éxito 200/201 |
| **Válida - Medio** | Rango medio | 50000, 8000000 | Éxito 200/201 |
| **Válida - Máximo** | Límite superior | 16000000 | Éxito 200/201 |
| **Inválida - Exceso** | Mayor al máximo | 16000001, 20000000 | Error 400 |
| **Inválida - Null** | Valor nulo | null | Error 400 |
| **Inválida - No numérico** | Texto | "abc" | Error 400 |

#### Campo: referencia_recaudo

| Clase de Equivalencia | Descripción | Valor de Prueba | Resultado Esperado |
|----------------------|-------------|-----------------|-------------------|
| **Inválida - Vacía** | String vacío | "" | Error 400 |
| **Inválida - Null** | Valor nulo | null | Error 400 |
| **Válida - Corta** | 1-10 caracteres | "REF-001" | Éxito 200/201 |
| **Válida - Media** | 11-50 caracteres | "REF-2024-NOVIEMBRE-001" | Éxito 200/201 |
| **Válida - Límite** | En el límite MAX | "REF-" + "X"*(MAX-4) | Éxito 200/201 |
| **Inválida - Excede** | Sobre el límite | "REF-" + "X"*500 | Error 400 |

#### Campo: nombre (remitente/destinatario)

| Clase de Equivalencia | Descripción | Valor de Prueba | Resultado Esperado |
|----------------------|-------------|-----------------|-------------------|
| **Inválida - Vacía** | String vacío | "" | Error 400 |
| **Inválida - Null** | Valor nulo | null | Error 400 |
| **Válida - Solo letras** | Alfabético | "Juan Perez" | Éxito 200/201 |
| **Válida - Con tildes** | Acentos | "José María" | Éxito 200/201 |
| **Válida - Con Ñ** | Letra Ñ | "Nuñez" | Éxito 200/201 |
| **Válida - Con apóstrofe** | Nombres compuestos | "O'Connor" | Éxito 200/201 |
| **Válida - Completo** | Nombre completo latino | "María Ángeles García López" | Éxito 200/201 |

---

### 2. Análisis de Valores Límite

#### Tabla de Valores Límite: valor_recaudo

| Valor | Posición | Resultado Esperado | Código HTTP | Descripción |
|-------|----------|-------------------|-------------|-------------|
| -1 | Muy debajo del mínimo | Error | 400 | Valor negativo inválido |
| 0 | Justo debajo del mínimo | Error | 400 | Cero no permitido |
| **1** | **Límite inferior exacto** | **Éxito** | **200/201** | Valor mínimo válido |
| 2 | Justo arriba del mínimo | Éxito | 200/201 | Primer valor sobre el mínimo |
| 8000000 | Centro del rango | Éxito | 200/201 | Valor medio |
| 15999999 | Justo debajo del máximo | Éxito | 200/201 | Último valor antes del máximo |
| **16000000** | **Límite superior exacto** | **Éxito** | **200/201** | Valor máximo válido |
| 16000001 | Justo arriba del máximo | Error | 400 | Primer valor inválido sobre máximo |
| 20000000 | Muy arriba del máximo | Error | 400 | Valor excesivo |

#### Valores Límite: referencia_recaudo (longitud)

Asumiendo un límite de 100 caracteres (a confirmar en pruebas):

| Longitud | Posición | Resultado Esperado |
|----------|----------|-------------------|
| 0 | Vacío | Error 400 |
| 1 | Mínimo | Éxito 200/201 |
| 50 | Medio | Éxito 200/201 |
| 99 | Justo debajo del máximo | Éxito 200/201 |
| **100** | **Límite exacto** | **Éxito 200/201** |
| 101 | Justo arriba del máximo | Error 400 |
| 500 | Muy arriba del máximo | Error 400 |

---

### 3. Tabla de Decisiones

**Condiciones de Entrada:**

| # | Ref. Válida | Valor Válido | Remitente Completo | Destinatario Completo | Token Válido |
|---|-------------|--------------|--------------------|-----------------------|--------------|
| 1 | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2 | ✗ | ✓ | ✓ | ✓ | ✓ |
| 3 | ✓ | ✗ | ✓ | ✓ | ✓ |
| 4 | ✓ | ✓ | ✗ | ✓ | ✓ |
| 5 | ✓ | ✓ | ✓ | ✗ | ✓ |
| 6 | ✓ | ✓ | ✓ | ✓ | ✗ |
| 7 | ✗ | ✗ | ✓ | ✓ | ✓ |
| 8 | ✓ | ✓ | ✗ | ✗ | ✓ |

**Acciones/Resultados:**

| # | Crear Guía | Código HTTP | Mensaje de Error |
|---|------------|-------------|------------------|
| 1 | ✓ | 200/201 | - |
| 2 | ✗ | 400 | Error en referencia_recaudo |
| 3 | ✗ | 400 | Error en valor_recaudo |
| 4 | ✗ | 400 | Error en datos remitente |
| 5 | ✗ | 400 | Error en datos destinatario |
| 6 | ✗ | 401 | Token inválido o expirado |
| 7 | ✗ | 400 | Múltiples errores de validación |
| 8 | ✗ | 400 | Múltiples campos obligatorios faltantes |

---

### 4. Transición de Estados

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE CREACIÓN DE GUÍA                │
└─────────────────────────────────────────────────────────────┘

    [INICIO]
       │
       ├──> [Validar Token de Autenticación]
       │         │
       │         ├─── Token Inválido ──> [Error 401] ──> [FIN]
       │         │
       │         └─── Token Válido
       │                   │
       ├──> [Validar Estructura del Payload]
       │         │
       │         ├─── Estructura Inválida ──> [Error 400: Campos Faltantes] ──> [FIN]
       │         │
       │         └─── Estructura Válida
       │                   │
       ├──> [Validar referencia_recaudo]
       │         │
       │         ├─── Excede límite ──> [Error 400: Referencia Excede Límite] ──> [FIN]
       │         │
       │         └─── Referencia Válida
       │                   │
       ├──> [Validar valor_recaudo]
       │         │
       │         ├─── Menor a $1 ──> [Error 400: Valor Fuera de Rango] ──> [FIN]
       │         ├─── Mayor a $16M ──> [Error 400: Valor Fuera de Rango] ──> [FIN]
       │         │
       │         └─── Valor en Rango ($1 - $16M)
       │                   │
       ├──> [Validar Datos de Remitente]
       │         │
       │         ├─── Incompleto ──> [Error 400: Remitente Incompleto] ──> [FIN]
       │         │
       │         └─── Completo
       │                   │
       ├──> [Validar Datos de Destinatario]
       │         │
       │         ├─── Incompleto ──> [Error 400: Destinatario Incompleto] ──> [FIN]
       │         │
       │         └─── Completo
       │                   │
       ├──> [TODAS LAS VALIDACIONES EXITOSAS]
       │         │
       │         ├──> [Generar ID Único de Guía]
       │         │
       │         ├──> [Almacenar en Base de Datos]
       │         │
       │         ├──> [Asignar Estado: "CREADA"]
       │         │
       │         ├──> [Registrar Timestamp de Creación]
       │         │
       │         └──> [Respuesta HTTP 200/201 con ID de Guía]
       │                   │
       └───────────> [GUÍA CREADA EXITOSAMENTE]
                           │
                     [Estado: CREADA]
                           │
                           ├─── Puede ser consultada via GET /guias/{id}
                           │
                           └─── Puede transitar a otros estados (fuera de alcance)
                                   │
                                [FIN]
```

**Estados Posibles de la Guía:**

1. **NO EXISTE** → Estado inicial antes de creación
2. **CREADA** → Guía registrada exitosamente en el sistema
3. **CONSULTA EXITOSA** → Guía consultada y datos retornados
4. **ERROR** → Intento de creación fallido por validaciones

---

## Dependencias

### Dependencias Técnicas
- API REST de Coordinadora disponible
- Servicio de autenticación OAuth 2.0 funcional
- Base de datos para almacenamiento de guías

### Dependencias de Negocio
- Definición clara de límites de valores de recaudo
- Especificación de campos obligatorios vs opcionales
- Reglas de validación de caracteres especiales

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Límite de referencia no documentado | Media | Medio | Pruebas exploratorias para determinar límite real |
| Cambios en validaciones del API | Baja | Alto | Monitoreo continuo y suite de regresión |
| Token expira durante pruebas | Media | Bajo | Implementar renovación automática de token |
| Caracteres especiales mal manejados | Media | Medio | Testing exhaustivo con diferentes encodings |

---

## Notas Técnicas

### Formato de Datos
- **Moneda:** Pesos colombianos (COP)
- **Formato de valor:** Número entero sin decimales
- **Encoding:** UTF-8 para soporte de caracteres especiales
- **Formato de fecha:** ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

### Rendimiento Esperado
- Tiempo de respuesta POST: < 500ms (p95)
- Tiempo de respuesta GET: < 300ms (p95)
- Disponibilidad: > 99.5%

---

## Casos de Prueba Derivados

De esta historia de usuario se derivan aproximadamente **25-30 casos de prueba**, incluyendo:

- ✅ 8 casos de prueba positivos (flujo exitoso)
- ❌ 17 casos de prueba negativos (validaciones y errores)
- 🔄 5 casos de prueba de integración (POST + GET)

**Ver documentación detallada en:**
- `casos-prueba.xlsx` - Matriz completa de casos
- `guias-rce.feature` - Especificaciones BDD en Gherkin

---

## Definición de Hecho (Definition of Done)

- [ ] Todos los criterios de aceptación están implementados
- [ ] Suite de pruebas automatizadas creada y ejecutándose
- [ ] Cobertura de código > 80%
- [ ] Pruebas de integración pasando
- [ ] Pruebas de carga completadas exitosamente
- [ ] Documentación técnica actualizada
- [ ] Code review aprobado
- [ ] Despliegue en ambiente de test exitoso

---

**Última Actualización:** Noviembre 2025  
**Autor:** Johan Parra  
**Versión:** 1.0

