# Reto Técnico Automatizador - Coordinadora

Suite completa de automatización de pruebas funcionales para el sistema de generación y consulta de guías logísticas con servicio de Recaudo Contra Entrega (RCE).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40-green.svg)](https://playwright.dev/)
[![k6](https://img.shields.io/badge/k6-latest-purple.svg)](https://k6.io/)

---

## 📋 Descripción del Proyecto

Este proyecto implementa una suite completa de pruebas automatizadas para validar el funcionamiento del API de guías logísticas de Coordinadora con RCE. El proyecto incluye:

- **Pruebas funcionales automatizadas** con Playwright y patrón Screenplay
- **Especificaciones BDD** en Gherkin (25+ escenarios)
- **Validación de casos exitosos** y manejo de errores
- **Validación de campos obligatorios** y rangos de valores
- **Pruebas de carga y estrés** con k6
- **Reportes detallados** en formato HTML, JSON y JUnit
- **Documentación completa** con análisis técnico y casos de prueba

### Alcance de las Pruebas

- ✅ Creación de guías con RCE
- ✅ Consulta de guías por ID
- ✅ Validación de campos obligatorios
- ✅ Validación de rangos de valores (valor a recaudar, referencia)
- ✅ Manejo de errores y códigos HTTP
- ✅ Autenticación OAuth 2.0
- ✅ Rendimiento bajo carga

---

## 🛠 Tecnologías Utilizadas

| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| **Playwright** | Framework de automatización de API | 1.40+ |
| **TypeScript** | Lenguaje de programación | 5.3+ |
| **Serenity-JS** | Patrón Screenplay para organización del código | 3.10+ |
| **Gherkin/BDD** | Especificaciones legibles en lenguaje natural | - |
| **k6** | Pruebas de carga y estrés | latest |
| **Node.js** | Runtime de JavaScript | 18+ |
| **dotenv** | Gestión de variables de ambiente | 16.3+ |

### Patrón de Diseño

El proyecto utiliza el **patrón Screenplay** de Serenity-JS, que organiza el código en:
- **Actors**: Representan usuarios o sistemas
- **Tasks**: Acciones de alto nivel (crear guía, consultar guía)
- **Interactions**: Acciones atómicas (POST, GET)
- **Questions**: Validaciones y assertions

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 (incluido con Node.js)
- **k6** (opcional, solo para pruebas de carga) ([Guía de instalación](https://k6.io/docs/getting-started/installation/))
- **Git** ([Descargar](https://git-scm.com/))

### Verificar Instalaciones

```bash
node --version  # Debe ser >= 18
npm --version   # Debe ser >= 9
k6 version      # Opcional, para pruebas de carga
```

---

## 🚀 Instalación

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/JohanParra/reto-tecnico-automatizador.git
cd reto-tecnico-automatizador
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- Playwright y sus dependencias
- Serenity-JS para patrón Screenplay
- TypeScript y tipos
- dotenv para variables de ambiente

### Paso 3: Instalar Navegadores de Playwright

```bash
npx playwright install
```

**Nota:** Aunque este proyecto es para pruebas de API (no requiere navegador), Playwright necesita los binarios instalados.

---

## ⚙️ Configuración

### Paso 1: Crear Archivo de Variables de Ambiente

Copia el archivo de ejemplo y crea tu archivo `.env`:

```bash
cp .env.example .env
```

### Paso 2: Configurar Credenciales

Edita el archivo `.env` con tus credenciales reales:

```env
# OAuth 2.0 Configuration
AUTH_URL=https://auth-endpoint.coordinadora.com/oauth/token
CLIENT_ID=tu_client_id_aqui
CLIENT_SECRET=tu_client_secret_aqui
GRANT_TYPE=client_credentials
SCOPE=openid

# API Configuration
API_BASE_URL=https://guias-service-test.coordinadora.com
API_TIMEOUT=30000

# Test Data
TEST_GUIA_ID=99021909297
```

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `AUTH_URL` | URL del endpoint de autenticación OAuth 2.0 | `https://auth.coordinadora.com/oauth/token` |
| `CLIENT_ID` | ID del cliente OAuth | `tu_client_id` |
| `CLIENT_SECRET` | Secret del cliente OAuth | `tu_client_secret` |
| `API_BASE_URL` | URL base de la API de guías | `https://guias-service-test.coordinadora.com` |
| `API_TIMEOUT` | Timeout en milisegundos | `30000` |
| `TEST_GUIA_ID` | ID de guía para pruebas | `99021909297` |

⚠️ **IMPORTANTE:** 
- El archivo `.env` está en `.gitignore` y **nunca debe ser commiteado** al repositorio
- Usa el archivo `.env.example` como referencia para las variables necesarias

---

## 🧪 Ejecución de Pruebas

### Ejecutar Todas las Pruebas

```bash
npm test
```

Este comando ejecutará todas las pruebas funcionales y generará reportes en:
- `reports/html/index.html` - Reporte visual interactivo
- `reports/json/results.json` - Datos en formato JSON
- `reports/junit/results.xml` - Para integración CI/CD

### Ver Reporte HTML

```bash
npm run report
```

Esto abrirá un servidor local con el reporte HTML interactivo de las pruebas ejecutadas.

### Ejecutar Pruebas Específicas

```bash
# Solo casos exitosos
npx playwright test guias-exitosas

# Solo validación de valor a recaudar
npx playwright test validacion-valor-recaudo

# Solo validación de campos obligatorios
npx playwright test campos-obligatorios

# Solo manejo de errores
npx playwright test manejo-errores

# Solo validación de autenticación
npx playwright test validacion-auth
```

### Modos de Ejecución

```bash
# Modo headed (con navegador visible - útil para debugging)
npm run test:headed

# Modo debug (pausa la ejecución para inspección)
npm run test:debug

# Modo UI (interfaz interactiva de Playwright)
npm run test:ui
```

### Pruebas de Carga y Estrés (k6)

#### Prueba de Carga

```bash
npm run load-test
```

**Configuración:**
- 20 usuarios simultáneos
- ~2 solicitudes/segundo por usuario
- Duración: 1 minuto
- Thresholds: p95 < 500ms, tasa de error < 1%

#### Prueba de Estrés

```bash
npm run stress-test
```

**Configuración:**
- Incremento gradual: 100 → 150 → 200 → 250 usuarios
- Duración: 1 minuto
- Objetivo: Identificar punto de falla

**Ver documentación completa:** [`load-tests/README.md`](load-tests/README.md)

---

## 📁 Estructura del Proyecto

```
reto-tecnico-automatizador/
├── docs/                           # Documentación completa
│   ├── analisis-tecnico.md        # Análisis de requisitos
│   ├── historia-usuario.md        # Historia de usuario con técnicas de testing
│   ├── casos-prueba.csv           # Matriz de 30+ casos de prueba
│   ├── COMO-EJECUTAR-FEATURES.md  # Guía de ejecución de features
│   └── postman/                   # Colecciones de Postman
│
├── src/                           # Código fuente (Patrón Screenplay)
│   ├── tasks/                     # Tareas de alto nivel
│   │   ├── CrearGuia.ts          # Tarea: Crear guía
│   │   └── ConsultarGuia.ts      # Tarea: Consultar guía
│   ├── interactions/              # Interacciones atómicas
│   │   ├── Post.ts               # Interacción: POST HTTP
│   │   └── Get.ts                # Interacción: GET HTTP
│   ├── questions/                 # Validaciones y assertions
│   │   ├── RespuestaHTTP.ts      # Question: Validar código HTTP
│   │   ├── MensajeError.ts       # Question: Validar errores
│   │   └── DatosGuiaAlmacenados.ts # Question: Validar persistencia
│   ├── helpers/                   # Utilidades
│   │   ├── auth.helper.ts        # Helper: Autenticación OAuth
│   │   ├── payload.builder.ts    # Helper: Constructor de payloads
│   │   └── validation.helper.ts  # Helper: Validación de endpoints
│   └── config/                    # Configuración
│       └── config.ts
│
├── tests/                         # Especificaciones de pruebas
│   ├── features/                  # Escenarios BDD en Gherkin
│   │   └── guias-rce.feature     # 25+ escenarios BDD
│   └── specs/                     # Especificaciones ejecutables
│       ├── guias-exitosas.spec.ts
│       ├── validacion-valor-recaudo.spec.ts
│       ├── campos-obligatorios.spec.ts
│       ├── validacion-referencia-recaudo.spec.ts
│       ├── validacion-auth.spec.ts
│       └── manejo-errores.spec.ts
│
├── load-tests/                    # Pruebas de rendimiento con k6
│   ├── scripts/
│   │   ├── config.js
│   │   ├── load-test.js
│   │   └── stress-test.js
│   └── README.md
│
├── reports/                       # Reportes de ejecución (generados)
│   ├── html/
│   ├── json/
│   └── junit/
│
├── .env.example                   # Template de variables de ambiente
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## 🐛 Troubleshooting

### Error: "Token no disponible" o "Error al obtener token"

**Problema:** Las credenciales OAuth no están configuradas correctamente.

**Solución:**
1. Verificar que el archivo `.env` existe en la raíz del proyecto
2. Verificar que `AUTH_URL`, `CLIENT_ID` y `CLIENT_SECRET` están configurados
3. Verificar que las credenciales son válidas y tienen los permisos necesarios

### Error: "ECONNREFUSED" o "Network timeout"

**Problema:** No hay conectividad con la API.

**Solución:**
1. Verificar que `API_BASE_URL` en `.env` es correcto
2. Verificar conectividad a internet
3. Verificar que el ambiente de test está disponible
4. Aumentar `API_TIMEOUT` si los tiempos de respuesta son lentos

### Error: "Module not found" o "Cannot find module"

**Problema:** Dependencias no instaladas correctamente.

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

### Pruebas fallan por timeout

**Problema:** Tiempos de respuesta lentos del servidor.

**Solución:**
1. Aumentar `API_TIMEOUT` en `.env` (ej: `60000` para 60 segundos)
2. Verificar carga del servidor
3. Ejecutar en horario de baja demanda

### k6: "command not found"

**Problema:** k6 no está instalado (solo necesario para pruebas de carga).

**Solución:**
```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6

# Windows
choco install k6
```

---

## 📚 Documentación Adicional

- **[Análisis Técnico](docs/analisis-tecnico.md)** - Especificaciones detalladas del sistema
- **[Historia de Usuario](docs/historia-usuario.md)** - Criterios de aceptación y técnicas de testing
- **[Casos de Prueba](docs/casos-prueba.csv)** - Matriz completa de 30+ casos
- **[Escenarios BDD](tests/features/guias-rce.feature)** - 25+ escenarios en Gherkin
- **[Pruebas de Carga](load-tests/README.md)** - Guía completa de k6
- **[Cómo Ejecutar Features](docs/COMO-EJECUTAR-FEATURES.md)** - Guía de ejecución de escenarios BDD

---

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para fines de evaluación técnica.

---

## 📧 Contacto

**Autor:** Johan Parra  
**Proyecto:** Reto Técnico Automatizador - Coordinadora

---

**Happy Testing! 🚀**
