# language: es
Característica: Gestión de Guías con Recaudo Contra Entrega (RCE)
  Como usuario del sistema de guías logísticas de Coordinadora
  Quiero crear y consultar guías con servicio de Recaudo Contra Entrega
  Para poder gestionar envíos con cobro al destinatario y validar la correcta persistencia de datos

  Antecedentes:
    Dado que tengo un token de autenticación válido
    Y la API está disponible en "https://guias-service-test.coordinadora.com"

  # ========================================
  # ESCENARIOS POSITIVOS - FLUJO EXITOSO
  # ========================================

  @exitoso @smoke
  Escenario: Crear guía con todos los datos válidos
    Dado que preparo un payload con los siguientes datos:
      | campo              | valor                        |
      | referencia_recaudo | REF-2024-001                |
      | valor_recaudo      | 50000                       |
      | remitente.nombre   | Juan Pérez García           |
      | remitente.ciudad   | Bogotá                      |
      | destinatario.nombre| María López Rodríguez       |
      | destinatario.ciudad| Medellín                    |
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 200 o 201
    Y la respuesta debe contener un campo "id" no vacío
    Y el campo "referencia_recaudo" en la respuesta debe ser "REF-2024-001"
    Y el campo "valor_recaudo" en la respuesta debe ser 50000

  @exitoso @integracion
  Escenario: Consultar guía previamente creada
    Dado que he creado una guía exitosamente con referencia "REF-CONSULTA-001"
    Y guardo el ID de la guía creada
    Cuando envío una solicitud GET al endpoint "/guias/{id}" usando el ID guardado
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe contener todos los datos enviados en la creación
    Y el campo "referencia_recaudo" debe ser "REF-CONSULTA-001"
    Y debe existir un campo "estado" con valor "creada" o similar
    Y debe existir un campo "fecha_creacion" con formato ISO 8601

  @exitoso @camposOpcionales
  Escenario: Crear guía sin campos opcionales
    Dado que preparo un payload con solo los campos obligatorios:
      | campo              | valor                        |
      | referencia_recaudo | REF-MINIMO-001              |
      | valor_recaudo      | 25000                       |
      | remitente.nombre   | Carlos Martínez             |
      | remitente.direccion| Calle 100 #20-30            |
      | remitente.ciudad   | Bogotá                      |
      | remitente.telefono | 3001234567                  |
      | destinatario.nombre| Ana Silva                   |
      | destinatario.direccion| Carrera 50 #10-20        |
      | destinatario.ciudad| Cali                        |
      | destinatario.telefono| 3109876543                |
    Y no incluyo los campos opcionales "observaciones", "descripcion_contenido", "peso"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 200 o 201
    Y la guía debe crearse exitosamente

  @exitoso @caracteresEspeciales
  Escenario: Crear guía con caracteres especiales en nombres
    Dado que preparo un payload con nombres que contienen caracteres especiales:
      | campo              | valor                        |
      | referencia_recaudo | REF-CHARS-001               |
      | valor_recaudo      | 30000                       |
      | remitente.nombre   | José María Núñez O'Connor   |
      | destinatario.nombre| María Ángeles Rodríguez     |
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 200 o 201
    Y cuando consulto la guía creada
    Y el nombre del remitente debe preservar "José María Núñez O'Connor"
    Y el nombre del destinatario debe preservar "María Ángeles Rodríguez"

  # ========================================
  # VALORES LÍMITE - VALOR A RECAUDAR
  # ========================================

  @valoresLimite @limiteInferior
  Escenario: Crear guía con valor mínimo permitido ($1)
    Dado que preparo un payload válido
    Y establezco el valor_recaudo en 1
    Y la referencia_recaudo es "REF-MINIMO-VALOR"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 200 o 201
    Y la guía debe crearse con valor_recaudo igual a 1

  @valoresLimite @limiteSuperior
  Escenario: Crear guía con valor máximo permitido ($16,000,000)
    Dado que preparo un payload válido
    Y establezco el valor_recaudo en 16000000
    Y la referencia_recaudo es "REF-MAXIMO-VALOR"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 200 o 201
    Y la guía debe crearse con valor_recaudo igual a 16000000

  @negativo @valoresLimite
  Escenario: Rechazar guía con valor igual a cero
    Dado que preparo un payload válido
    Y establezco el valor_recaudo en 0
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe contener un mensaje de error sobre el rango de valores
    Y la guía no debe ser creada

  @negativo @valoresLimite
  Escenario: Rechazar guía con valor mayor al máximo ($16,000,001)
    Dado que preparo un payload válido
    Y establezco el valor_recaudo en 16000001
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe contener un mensaje de error sobre el límite máximo
    Y la guía no debe ser creada

  @negativo @valoresLimite
  Esquema del escenario: Rechazar valores fuera del rango permitido
    Dado que preparo un payload válido
    Y establezco el valor_recaudo en <valor>
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe contener un mensaje de error

    Ejemplos:
      | valor      | descripcion           |
      | -1000      | valor negativo        |
      | -1         | valor negativo mínimo |
      | 0          | valor cero            |
      | 20000000   | muy por encima        |
      | 16000001   | justo arriba máximo   |

  # ========================================
  # VALIDACIÓN DE CAMPOS OBLIGATORIOS
  # ========================================

  @negativo @camposObligatorios
  Escenario: Rechazar guía sin referencia de recaudo
    Dado que preparo un payload válido
    Pero no incluyo el campo "referencia_recaudo"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar que "referencia_recaudo" es obligatorio

  @negativo @camposObligatorios
  Escenario: Rechazar guía sin valor de recaudo
    Dado que preparo un payload válido
    Pero no incluyo el campo "valor_recaudo"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar que "valor_recaudo" es obligatorio

  @negativo @camposObligatorios
  Escenario: Rechazar guía sin datos de remitente
    Dado que preparo un payload válido
    Pero no incluyo el campo "remitente"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar que los datos del remitente son obligatorios

  @negativo @camposObligatorios
  Escenario: Rechazar guía sin datos de destinatario
    Dado que preparo un payload válido
    Pero no incluyo el campo "destinatario"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar que los datos del destinatario son obligatorios

  @negativo @camposObligatorios
  Escenario: Rechazar guía con remitente incompleto
    Dado que preparo un payload válido
    Y el objeto "remitente" solo contiene el campo "nombre"
    Pero faltan "direccion", "ciudad" y "telefono"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar qué campos del remitente faltan

  @negativo @camposObligatorios
  Escenario: Rechazar guía con destinatario incompleto
    Dado que preparo un payload válido
    Y el objeto "destinatario" solo contiene el campo "nombre"
    Pero faltan "direccion", "ciudad" y "telefono"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar qué campos del destinatario faltan

  # ========================================
  # VALIDACIÓN DE REFERENCIA DE RECAUDO
  # ========================================

  @negativo @longitudCampos
  Escenario: Rechazar referencia de recaudo que excede el límite
    Dado que preparo un payload válido
    Y establezco la referencia_recaudo con 500 caracteres
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar que la referencia excede el límite de caracteres

  @negativo @longitudCampos
  Escenario: Rechazar referencia de recaudo vacía
    Dado que preparo un payload válido
    Y establezco la referencia_recaudo como una cadena vacía ""
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe indicar que la referencia no puede estar vacía

  # ========================================
  # SEGURIDAD Y AUTENTICACIÓN
  # ========================================

  @negativo @seguridad
  Escenario: Rechazar solicitud POST sin token de autenticación
    Dado que preparo un payload válido
    Pero no incluyo el header "Authorization"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 401
    Y la respuesta debe indicar error de autenticación

  @negativo @seguridad
  Escenario: Rechazar solicitud GET sin token de autenticación
    Dado que no incluyo el header "Authorization"
    Cuando envío una solicitud GET al endpoint "/guias/99021909297"
    Entonces el código de respuesta debe ser 401
    Y la respuesta debe indicar error de autenticación

  @negativo @seguridad
  Escenario: Rechazar solicitud con token inválido
    Dado que preparo un payload válido
    Y uso un token de autenticación inválido "INVALID_TOKEN_XYZ"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 401
    Y la respuesta debe indicar que el token es inválido

  # ========================================
  # MANEJO DE ERRORES
  # ========================================

  @negativo @notFound
  Escenario: Consultar guía con ID inexistente
    Dado que uso un ID de guía que no existe "99999999999"
    Cuando envío una solicitud GET al endpoint "/guias/99999999999"
    Entonces el código de respuesta debe ser 404
    Y la respuesta debe indicar que la guía no fue encontrada

  @negativo @payload
  Escenario: Enviar payload completamente vacío
    Dado que preparo un payload vacío "{}"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe listar los campos requeridos faltantes

  @negativo @payload
  Escenario: Enviar payload con múltiples errores
    Dado que preparo un payload con los siguientes datos inválidos:
      | campo              | valor    |
      | referencia_recaudo |          |
      | valor_recaudo      | 0        |
    Y no incluyo "remitente" ni "destinatario"
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe contener información sobre los errores de validación

  # ========================================
  # PRUEBAS EXPLORATORIAS
  # ========================================

  @exploratorio
  Escenario: Verificar comportamiento con referencia de recaudo duplicada
    Dado que creo una guía con referencia "REF-DUPLICADA-001"
    Y la guía se crea exitosamente
    Cuando intento crear otra guía con la misma referencia "REF-DUPLICADA-001"
    Entonces debo documentar si el sistema acepta o rechaza referencias duplicadas

  @exploratorio @rendimiento
  Escenario: Medir tiempo de respuesta para creación de guía
    Dado que preparo un payload válido
    Y registro el timestamp inicial
    Cuando envío una solicitud POST al endpoint "/guias"
    Y registro el timestamp final
    Entonces el tiempo de respuesta debe ser menor a 1000ms
    Y idealmente menor a 500ms para el percentil 95

  # ========================================
  # VALIDACIÓN DE DATOS
  # ========================================

  @validacion
  Esquema del escenario: Validar diferentes tipos de datos en valor_recaudo
    Dado que preparo un payload válido
    Y establezco el valor_recaudo como <tipo_dato>
    Cuando envío una solicitud POST al endpoint "/guias"
    Entonces el código de respuesta debe ser <codigo_esperado>

    Ejemplos:
      | tipo_dato | codigo_esperado | descripcion           |
      | "texto"   | 400             | string en lugar de número |
      | null      | 400             | valor nulo            |
      | 1.5       | 200/400         | decimal (documentar)  |
      | 50000     | 200             | número entero válido  |

  @validacion @integracion
  Escenario: Verificar integridad de datos en flujo completo
    Dado que creo una guía con los siguientes datos específicos:
      | campo                      | valor                           |
      | referencia_recaudo         | REF-INTEGRIDAD-2024             |
      | valor_recaudo              | 125500                          |
      | remitente.nombre           | Pedro Fernández López           |
      | remitente.ciudad           | Barranquilla                    |
      | destinatario.nombre        | Laura Gómez Martínez            |
      | destinatario.ciudad        | Cartagena                       |
      | observaciones              | Entregar en horario de oficina  |
    Y guardo el ID de la guía creada
    Cuando consulto la guía mediante GET
    Entonces todos los campos deben coincidir exactamente:
      | campo                      | valor_esperado                  |
      | referencia_recaudo         | REF-INTEGRIDAD-2024             |
      | valor_recaudo              | 125500                          |
      | remitente.nombre           | Pedro Fernández López           |
      | remitente.ciudad           | Barranquilla                    |
      | destinatario.nombre        | Laura Gómez Martínez            |
      | destinatario.ciudad        | Cartagena                       |
      | observaciones              | Entregar en horario de oficina  |

