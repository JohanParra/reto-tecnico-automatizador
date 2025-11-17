# Reto Técnico Automatizador - Coordinadora

Suite completa de automatización de pruebas para el sistema de generación y consulta de guías logísticas con servicio de Recaudo Contra Entrega (RCE).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40-green.svg)](https://playwright.dev/)
[![k6](https://img.shields.io/badge/k6-latest-purple.svg)](https://k6.io/)

---

## 📋 Descripción del Proyecto

Este proyecto implementa una suite completa de pruebas automatizadas siguiendo las mejores prácticas de QA Automation, incluyendo:

- ✅ Análisis técnico y documentación de requisitos
- ✅ Historias de usuario con técnicas de testing (Partición de Equivalencia, Valores Límite, Tabla de Decisiones)
- ✅ Matriz completa de casos de prueba (30+ casos)
- ✅ Especificaciones BDD en Gherkin (25+ escenarios)
- ✅ Pruebas manuales con Postman
- ✅ Automatización con Playwright + Patrón Screenplay
- ✅ Pruebas de carga y estrés con k6
- ✅ Reportes detallados y análisis de rendimiento

---

## 🎯 Objetivos

1. Validar la creación y consulta de guías con RCE
2. Verificar validaciones de campos obligatorios y rangos de valores
3. Confirmar manejo correcto de errores
4. Evaluar rendimiento bajo carga y estrés
5. Documentar comportamiento del sistema de forma exhaustiva

---

## 🛠 Tecnologías Utilizadas

| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| **Playwright** | Automatización de API | 1.40+ |
| **TypeScript** | Lenguaje de programación | 5.3+ |
| **Serenity-JS** | Patrón Screenplay | 3.10+ |
| **Gherkin/BDD** | Especificaciones legibles | - |
| **k6** | Pruebas de carga y estrés | latest |
| **Postman** | Pruebas manuales exploratorias | - |
| **Node.js** | Runtime | 18+ |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 (incluido con Node.js)
- **k6** ([Guía de instalación](https://k6.io/docs/getting-started/installation/))
- **Git** ([Descargar](https://git-scm.com/))
- **Postman** (opcional, para pruebas manuales) ([Descargar](https://www.postman.com/downloads/))

Verificar instalaciones:

```bash
node --version  # Debe ser >= 18
npm --version   # Debe ser >= 9
k6 version      # Cualquier versión reciente
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/reto-tecnico-automatizador.git
cd reto-tecnico-automatizador
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:
- Playwright y sus dependencias
- Serenity-JS para patrón Screenplay
- TypeScript y tipos
- dotenv para variables de ambiente

### 3. Instalar navegadores de Playwright

```bash
npx playwright install
```

### 4. Configurar variables de ambiente

Crear archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Editar `.env` con las credenciales reales:

```env
# OAuth 2.0 Configuration
AUTH_URL=https://auth-endpoint.coordinadora.com/oauth/token
CLIENT_ID=tu_client_id_aqui
CLIENT_SECRET=tu_client_secret_aqui
GRANT_TYPE=client_credentials

# API Configuration
API_BASE_URL=https://guias-service-test.coordinadora.com
API_TIMEOUT=30000

# Test Data
TEST_GUIA_ID=99021909297
```

⚠️ **IMPORTANTE:** Nunca commitear el archivo `.env` con credenciales reales.

---

## 🧪 Ejecución de Pruebas

### Pruebas Automatizadas (Playwright)

#### Ejecutar todas las pruebas

```bash
npm test
```

#### Ejecutar pruebas en modo headed (con navegador visible)

```bash
npm run test:headed
```

#### Ejecutar pruebas en modo debug

```bash
npm run test:debug
```

#### Ejecutar pruebas específicas

```bash
# Solo casos exitosos
npx playwright test guias-exitosas

# Solo validación de valor a recaudar
npx playwright test validacion-valor-recaudo

# Solo campos obligatorios
npx playwright test campos-obligatorios
```

#### Ver reporte de resultados

```bash
npm run report
```

Esto abrirá un servidor local con el reporte HTML de las pruebas ejecutadas.

---

### Pruebas de Carga y Estrés (k6)

#### Prueba de Carga (20 usuarios, 1 minuto)

```bash
npm run load-test
```

**Configuración:**
- 20 usuarios simultáneos
- ~2 solicitudes/segundo por usuario
- Duración: 1 minuto
- Total: ~100 requests

**Thresholds:**
- Tiempo respuesta p95 < 500ms
- Tasa de error < 1%

#### Prueba de Estrés (100-250 usuarios)

```bash
npm run stress-test
```

**Configuración:**
- Incremento gradual: 100 → 150 → 200 → 250 usuarios
- Duración: 1 minuto
- Objetivo: Identificar punto de falla

**Ver documentación completa:** [`load-tests/README.md`](load-tests/README.md)

---

### Pruebas Manuales (Postman)

1. Abrir Postman
2. Importar colección: `docs/postman/Coordinadora-Guias-RCE.postman_collection.json`
3. Importar environment: `docs/postman/Coordinadora-Test.postman_environment.json`
4. Configurar credenciales OAuth en el environment
5. Ejecutar carpeta "0. Autenticación" para obtener token
6. Ejecutar el resto de requests

---

## 📁 Estructura del Proyecto

```
reto-tecnico-automatizador/
├── docs/                           # Documentación completa
│   ├── analisis-tecnico.md        # Análisis de requisitos y especificaciones
│   ├── historia-usuario.md        # Historia de usuario con técnicas de testing
│   ├── casos-prueba.csv           # Matriz de 30+ casos de prueba
│   ├── validacion-inicial.md      # Resultados de validación de endpoints
│   ├── reporte-pruebas-manuales.md # Reporte de ejecución manual
│   └── postman/                   # Colecciones y environments de Postman
│       ├── Coordinadora-Guias-RCE.postman_collection.json
│       └── Coordinadora-Test.postman_environment.json
│
├── src/                           # Código fuente (Patrón Screenplay)
│   ├── actors/                    # Actores del sistema
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
│   ├── helpers/                   # Utilidades y helpers
│   │   ├── auth.helper.ts        # Helper: Autenticación OAuth
│   │   ├── payload.builder.ts    # Helper: Constructor de payloads
│   │   └── validation.helper.ts  # Helper: Validación de endpoints
│   └── config/                    # Configuración centralizada
│       └── config.ts
│
├── tests/                         # Especificaciones de pruebas
│   ├── features/                  # Escenarios BDD en Gherkin
│   │   └── guias-rce.feature     # 25+ escenarios BDD
│   └── specs/                     # Especificaciones ejecutables
│       ├── guias-exitosas.spec.ts          # Casos exitosos
│       ├── validacion-valor-recaudo.spec.ts # Validación de rangos
│       ├── campos-obligatorios.spec.ts     # Campos requeridos
│       ├── validacion-referencia-recaudo.spec.ts # Límites de longitud
│       └── manejo-errores.spec.ts          # Manejo de errores
│
├── load-tests/                    # Pruebas de rendimiento con k6
│   ├── scripts/
│   │   ├── config.js             # Configuración compartida
│   │   ├── load-test.js          # Prueba de carga (20 usuarios)
│   │   └── stress-test.js        # Prueba de estrés (100-250 usuarios)
│   ├── reports/                   # Reportes de k6 (JSON)
│   │   └── analisis-rendimiento.md # Análisis detallado
│   └── README.md                  # Guía de pruebas de carga
│
├── reports/                       # Reportes de ejecución
│   ├── html/                      # Reportes HTML de Playwright
│   ├── json/                      # Reportes JSON
│   └── junit/                     # Reportes JUnit (CI/CD)
│
├── .env.example                   # Template de variables de ambiente
├── .gitignore                     # Archivos ignorados por Git
├── package.json                   # Dependencias y scripts
├── playwright.config.ts           # Configuración de Playwright
├── tsconfig.json                  # Configuración de TypeScript
└── README.md                      # Este archivo
```

---

## 📊 Interpretación de Reportes

### Reportes de Playwright

Después de ejecutar `npm test`, los reportes se generan en:

- **HTML:** `reports/html/index.html` - Reporte visual interactivo
- **JSON:** `reports/json/results.json` - Datos en formato JSON
- **JUnit:** `reports/junit/results.xml` - Para integración CI/CD

Para ver el reporte HTML:

```bash
npm run report
```

### Reportes de k6

Los reportes de k6 se generan en formato JSON en `load-tests/reports/`:

- `load-test-results.json` - Métricas de prueba de carga
- `stress-test-results.json` - Métricas de prueba de estrés

**Métricas clave a revisar:**

| Métrica | Descripción | Valor Ideal |
|---------|-------------|-------------|
| `http_req_duration` | Tiempo total del request | < 500ms (p95) |
| `http_req_failed` | % de requests fallidas | < 1% |
| `http_reqs` | Requests por segundo | Según carga |

---

## 🎨 Patrón Screenplay

Este proyecto implementa el **patrón Screenplay** de Serenity-JS, que organiza el código en:

### Actors (Actores)
Representan usuarios o sistemas que interactúan con la aplicación.

### Tasks (Tareas)
Acciones de alto nivel que un actor puede realizar:
```typescript
const tarea = CrearGuia.conDatos(payload);
await tarea.ejecutar();
```

### Interactions (Interacciones)
Acciones atómicas de bajo nivel:
```typescript
await Post.to('/guias', payload);
await Get.from('/guias/123');
```

### Questions (Preguntas)
Validaciones sobre el estado del sistema:
```typescript
RespuestaHTTP.esExitosa(response);
DatosGuiaAlmacenados.coincidenCon(response, payload);
```

**Ventajas del patrón Screenplay:**
- ✅ Código más legible y mantenible
- ✅ Reutilización de componentes
- ✅ Separación de responsabilidades
- ✅ Fácil de extender

---

## 🐛 Troubleshooting

### Error: "Token no disponible"

**Problema:** Las credenciales OAuth no están configuradas.

**Solución:**
1. Verificar que `.env` existe y tiene las credenciales correctas
2. Verificar que `AUTH_URL`, `CLIENT_ID` y `CLIENT_SECRET` están configurados

### Error: "ECONNREFUSED" o "Network timeout"

**Problema:** No hay conectividad con la API.

**Solución:**
1. Verificar que `API_BASE_URL` en `.env` es correcto
2. Verificar conectividad a internet
3. Verificar que el ambiente de test está disponible

### Error: "Module not found"

**Problema:** Dependencias no instaladas.

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

### Pruebas fallan por timeout

**Problema:** Tiempos de respuesta lentos.

**Solución:**
1. Aumentar `API_TIMEOUT` en `.env`
2. Verificar carga del servidor
3. Ejecutar en horario de baja demanda

### k6: "command not found"

**Problema:** k6 no está instalado.

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
- **[Reporte Manual](docs/reporte-pruebas-manuales.md)** - Resultados de Postman

---

## 🔄 Integración Continua (CI/CD)

Este proyecto está preparado para integrarse con sistemas de CI/CD:

### GitHub Actions

Crear `.github/workflows/tests.yml`:

```yaml
name: Automated Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: reports/
```

### Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Report') {
            steps {
                publishHTML([
                    reportDir: 'reports/html',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
                ])
            }
        }
    }
}
```

---

## 📝 Commits Semánticos

Este proyecto usa commits semánticos:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat:` | Nueva funcionalidad | `feat: agregar validación de caracteres especiales` |
| `test:` | Nuevos tests | `test: agregar casos de valores límite` |
| `docs:` | Documentación | `docs: actualizar README con instrucciones` |
| `fix:` | Corrección de bugs | `fix: corregir validación de token expirado` |
| `refactor:` | Mejora de código | `refactor: extraer lógica de auth a helper` |
| `chore:` | Tareas de mantenimiento | `chore: actualizar dependencias` |

---

## 👥 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear branch con feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit con mensajes semánticos: `git commit -m "feat: agregar nueva validación"`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## ✅ Checklist de Calidad

Antes de considerar el proyecto completo:

- [x] Análisis técnico documentado
- [x] Historia de usuario con técnicas de testing
- [x] Matriz de casos de prueba (30+)
- [x] Escenarios BDD (25+)
- [x] Colección Postman configurada
- [x] Patrón Screenplay implementado
- [x] Suite automatizada ejecutable
- [x] Pruebas de carga con k6
- [x] Pruebas de estrés con k6
- [x] Reportes configurados
- [x] README completo
- [x] Documentación organizada
- [x] .gitignore configurado
- [x] Sin credenciales expuestas

---

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para fines de evaluación técnica.

---

## 📧 Contacto

**Autor:** Johan Parra  
**Fecha:** Noviembre 2025  
**Proyecto:** Reto Técnico Automatizador - Coordinadora

---

## 🙏 Agradecimientos

- Equipo de Coordinadora por proporcionar el reto técnico
- Comunidad de Playwright y Serenity-JS por las herramientas
- Comunidad de k6 por la herramienta de load testing

---

**Happy Testing! 🚀**

