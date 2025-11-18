# language: en
Feature: Gestión de Guías con Recaudo Contra Entrega (RCE)
  Como usuario operativo del sistema de guías logísticas de Coordinadora
  Quiero crear y consultar guías con servicio de Recaudo Contra Entrega (RCE)
  Para poder gestionar eficientemente los envíos con cobro al destinatario

  Background:
    Given que tengo un token de autenticación válido
    And la API está disponible en "https://guias-service-test.coordinadora.com"
    And tengo un payload válido base preparado

  # ========================================
  # CA-001: Creación Exitosa con Datos Válidos
  # ========================================

  @exitoso @smoke @CA-001
  Scenario Outline: Crear guía con todos los datos válidos
    Given que preparo un payload válido
    And establezco la referenciaRecaudo en "REF-2024-001"
    And establezco el valorRecaudar en 38500
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 200

  # ========================================
  # CA-002: Consultar Guía Creada
  # ========================================

  @exitoso @integracion @CA-002
  Scenario: Consultar guía previamente creada
    Given que he creado una guía exitosamente con referencia "REF-CONSULTA-001"
    And guardo el ID de la guía creada
    When envío una solicitud GET al endpoint "/guias/{id}" usando el ID guardado
    Then el código de respuesta debe ser 200
    And la respuesta debe contener todos los datos enviados en la creación
    And el campo "codigoRemision" debe ser "REF-CONSULTA-001"

  # ========================================
  # CA-003, CA-004, CA-005: Validación de Valores Límite
  # ========================================

  @negativo @valoresLimite @CA-003 @CA-004
  Scenario Outline: Rechazar guía con valores fuera de rango permitido
    Given que preparo un payload válido
    And establezco el valorRecaudar en <valor>
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 400

    Examples:
      | descripcion              | valor    |
      | valor igual a cero       | 0        |
      | valor negativo           | -1000    |
      | valor mayor al máximo    | 16000001 |

  @valoresLimite @limiteInferior @limiteSuperior @CA-005
  Scenario Outline: Crear guía con valores en los límites permitidos
    Given que preparo un payload válido
    And establezco el valorRecaudar en <valor>
    And la referenciaRecaudo es "<referencia>"
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 200

    Examples:
      | descripcion              | valor     | referencia         |
      | valor mínimo permitido   | 1         | REF-MINIMO-VALOR   |
      | valor máximo permitido   | 16000000  | REF-MAXIMO-VALOR   |

  # ========================================
  # CA-006: Validar Longitud de Referencia
  # ========================================

  @negativo @longitudCampos @CA-006
  Scenario: Rechazar guía con referencia de recaudo que excede el límite
    Given que preparo un payload válido
    And establezco la referenciaRecaudo con 31 caracteres
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 400

  # ========================================
  # CA-007: Campos Obligatorios del Remitente
  # ========================================

  @negativo @camposObligatorios @CA-007
  Scenario: Rechazar guía sin datos de remitente
    Given que preparo un payload válido
    And no incluyo el campo "datosRemitente"
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 400

  @negativo @camposObligatorios @CA-007
  Scenario Outline: Rechazar guía con remitente incompleto - falta campo obligatorio
    Given que preparo un payload válido
    And el objeto "datosRemitente" no contiene el campo "<campo>"
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 400

    Examples:
      | descripcion | campo                    |
      | nombre      | nombreRemitente          |
      | dirección   | direccionRemitente       |
      | ciudad      | codigoCiudadRemitente    |
      | teléfono    | celularRemitente         |

  # ========================================
  # CA-008: Campos Obligatorios del Destinatario
  # ========================================
  # Nota: El payload proporcionado no incluye destinatario explícito
  # Se mantiene el escenario por si se requiere en el futuro

  @negativo @camposObligatorios @CA-008
  Scenario: Rechazar guía sin datos de destinatario
    Given que preparo un payload válido
    And no incluyo el campo "datosDestinatario"
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 400

  # ========================================
  # CA-009, CA-010: Campos Obligatorios Generales
  # ========================================

  @negativo @camposObligatorios @CA-009 @CA-010
  Scenario Outline: Rechazar guía sin campo obligatorio
    Given que preparo un payload válido
    And no incluyo el campo "<campo>"
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 400

    Examples:
      | descripcion              | campo              |
      | valor de recaudo         | valorRecaudar      |
      | referencia de recaudo    | referenciaRecaudo  |

  # ========================================
  # CA-011: Soportar Caracteres Especiales
  # ========================================

  @exitoso @caracteresEspeciales @CA-011
  Scenario: Crear guía con caracteres especiales en nombres
    Given que preparo un payload válido
    And establezco la referenciaRecaudo en "REF-CHARS-001"
    And establezco el valorRecaudar en 30000
    And establezco el nombreRemitente en "José María Núñez O'Connor"
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 200

  # ========================================
  # CA-012: Campos Opcionales
  # ========================================

  @exitoso @camposOpcionales @CA-012
  Scenario: Crear guía sin campos opcionales
    Given que preparo un payload válido
    And establezco la referenciaRecaudo en "REF-MINIMO-001"
    And establezco el valorRecaudar en 25000
    And no incluyo los campos opcionales "observaciones"
    When envío una solicitud POST al endpoint "/guias"
    Then el código de respuesta debe ser 200
