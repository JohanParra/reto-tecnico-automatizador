# Pruebas de Carga y Estrés con k6

## Requisitos

### Instalación de k6

**macOS (Homebrew):**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /usr/share/keyrings/k6-archive-keyring.list
sudo apt-get update
sudo apt-get install k6
```

**Windows (Chocolatey):**
```powershell
choco install k6
```

### Configurar Variables de Ambiente

Crear archivo `.env` en la raíz del proyecto con:

```env
API_BASE_URL=https://guias-service-test.coordinadora.com
AUTH_URL=https://auth-endpoint.example.com/oauth/token
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
TEST_GUIA_ID=99021909297
```

**Nota:** Los scripts npm (`npm run load-test` y `npm run stress-test`) cargan automáticamente las variables de entorno desde el archivo `.env`. Si ejecutas k6 directamente, debes pasar las variables manualmente:

```bash
AUTH_URL=... CLIENT_ID=... CLIENT_SECRET=... k6 run load-tests/scripts/load-test.js
```

---

## Prueba de Carga (load-test.js)

### Objetivo
Validar el comportamiento del sistema bajo carga sostenida esperada.

### Configuración
- **Usuarios simultáneos:** 20
- **Duración:** 1 minuto
- **Solicitudes:** ~2 req/seg por usuario
- **Total requests:** ~100

### Ejecución

```bash
# Desde la raíz del proyecto (recomendado - carga .env automáticamente)
npm run load-test

# Con opciones adicionales de k6 usando el script wrapper
./load-tests/scripts/run-k6.sh load-test.js --out json=load-tests/reports/load-test-results.json

# Con InfluxDB (requiere cargar variables de entorno)
./load-tests/scripts/run-k6.sh load-test.js --out influxdb=http://localhost:8086

# O directamente con k6 (requiere variables de entorno en el sistema)
AUTH_URL=... CLIENT_ID=... CLIENT_SECRET=... k6 run load-tests/scripts/load-test.js
```

### Thresholds de Éxito
- ✅ Tiempo de respuesta p95 < 500ms
- ✅ Tiempo de respuesta p99 < 1000ms
- ✅ Tasa de error < 1%
- ✅ Sin errores 5xx

### Interpretación de Resultados

**Métricas Clave:**
- `http_req_duration`: Tiempo de respuesta
- `http_req_failed`: Tasa de fallos
- `http_reqs`: Requests por segundo
- `get_guia_duration`: Tiempo específico de consultas GET

**Resultados Esperados:**
```
✓ http_req_duration..............: avg=250ms min=100ms med=230ms max=450ms p(95)=400ms p(99)=480ms
✓ http_req_failed................: 0.00% ✓ 100 ✗ 0
✓ http_reqs......................: 100 (1.66/s)
```

---

## Prueba de Estrés (stress-test.js)

### Objetivo
Identificar el punto de falla del sistema bajo carga incremental.

### Configuración
- **Usuarios iniciales:** 100
- **Incremento:** +50 cada 15 segundos
- **Duración:** 1 minuto
- **Pico:** 250 usuarios concurrentes

### Progresión
```
0-15s:  100 usuarios
15-30s: 150 usuarios (+50)
30-45s: 200 usuarios (+50)
45-60s: 250 usuarios (+50)
60-70s: Ramp-down a 0
```

### Ejecución

```bash
# Desde la raíz del proyecto (recomendado - carga .env automáticamente)
npm run stress-test

# Con opciones adicionales de k6 usando el script wrapper
./load-tests/scripts/run-k6.sh stress-test.js --out json=load-tests/reports/stress-test-results.json

# Con InfluxDB (requiere cargar variables de entorno)
./load-tests/scripts/run-k6.sh stress-test.js --out influxdb=http://localhost:8086

# O directamente con k6 (requiere variables de entorno en el sistema)
AUTH_URL=... CLIENT_ID=... CLIENT_SECRET=... k6 run load-tests/scripts/stress-test.js
```

### Thresholds (Más Permisivos)
- ⚠️ Tiempo de respuesta p95 < 1000ms
- ⚠️ Tiempo de respuesta p99 < 2000ms
- ⚠️ Tasa de error < 5%

### Análisis Esperado

**Puntos a Identificar:**
1. **Punto de Degradación:** En qué nivel de usuarios empieza a degradarse el rendimiento
2. **Punto de Falla:** Cuántos usuarios causan errores 5xx
3. **Rate Limiting:** Si el sistema tiene límites de requests configurados
4. **Cuellos de Botella:** Qué componente falla primero (API, DB, Auth)

---

## Visualización de Reportes

k6 ofrece varias formas de visualizar los resultados de las pruebas:

### 1. Reporte en Consola (por defecto)

Al ejecutar una prueba, k6 muestra un resumen en consola con:
- ✅/✗ Estado de los thresholds
- Métricas agregadas (promedio, min, max, percentiles)
- Tasa de errores
- Requests por segundo

**Ejemplo de salida:**
```
  █ THRESHOLDS 
    ✓ http_req_duration p(95)<500
    ✓ http_req_failed rate<0.01
    
  █ TOTAL RESULTS
    http_reqs......................: 356    18.53/s
    http_req_duration..............: avg=285.79ms p(95)=616.37ms
    http_req_failed................: 0.00%  0/356
```

### 2. Dashboard Web Interactivo (Recomendado)

k6 incluye un dashboard web en tiempo real que muestra gráficos interactivos:

```bash
# Habilitar dashboard web
K6_WEB_DASHBOARD=true ./load-tests/scripts/run-k6.sh load-test.js

# El dashboard estará disponible en:
# http://localhost:5665
```

**Características del dashboard:**
- 📊 Gráficos en tiempo real de métricas
- 📈 Visualización de percentiles
- 🔍 Filtros y zoom en el tiempo
- 📉 Comparación de métricas

### 3. Reporte JSON

Genera un archivo JSON con todos los datos para análisis posterior:

```bash
# Generar reporte JSON
./load-tests/scripts/run-k6.sh load-test.js --out json=load-tests/reports/load-test-results.json
```

El JSON contiene:
- Todas las métricas punto por punto
- Timestamps de cada métrica
- Tags y agrupaciones
- Datos completos para análisis

### 4. InfluxDB + Grafana (Visualización Avanzada)

Para dashboards profesionales y análisis histórico:

```bash
# 1. Iniciar InfluxDB
docker run -d -p 8086:8086 influxdb:1.8

# 2. Ejecutar prueba enviando datos a InfluxDB
./load-tests/scripts/run-k6.sh load-test.js --out influxdb=http://localhost:8086

# 3. Conectar Grafana a InfluxDB para visualización
# (Requiere configuración adicional de Grafana)
```

### 5. Cloud k6 (Servicio en la Nube)

Para reportes en la nube con análisis avanzado:

```bash
# Requiere cuenta en k6 Cloud
k6 cloud load-tests/scripts/load-test.js
```

## Estructura de Reportes

Los reportes se generan en `load-tests/reports/`:

```
load-tests/reports/
├── load-test-results.json      # Resultados de prueba de carga (JSON)
├── stress-test-results.json    # Resultados de prueba de estrés (JSON)
└── analisis-rendimiento.md     # Análisis y conclusiones (Markdown)
```

---

## Análisis de Métricas

### Métricas de k6

| Métrica | Descripción | Valor Ideal |
|---------|-------------|-------------|
| `http_req_duration` | Tiempo total de request | < 500ms (p95) |
| `http_req_blocked` | Tiempo bloqueado en setup | < 10ms |
| `http_req_connecting` | Tiempo de conexión TCP | < 100ms |
| `http_req_tls_handshaking` | Tiempo de TLS handshake | < 200ms |
| `http_req_sending` | Tiempo enviando datos | < 10ms |
| `http_req_waiting` | Tiempo esperando respuesta | < 400ms |
| `http_req_receiving` | Tiempo recibiendo datos | < 50ms |
| `http_req_failed` | % de requests fallidas | < 1% |

### Percentiles

- **p(50)** (mediana): Experiencia del usuario típico
- **p(90)**: 90% de usuarios experimentan esto o mejor
- **p(95)**: Threshold estándar para SLA
- **p(99)**: Casos extremos pero importantes

---

## Troubleshooting

### Error: Token no disponible
```
❌ Error: Variables de autenticación no configuradas
   AUTH_URL: ❌ NO CONFIGURADO
   CLIENT_ID: ❌ NO CONFIGURADO
   CLIENT_SECRET: ❌ NO CONFIGURADO
```
**Solución:** 
1. Verificar que el archivo `.env` existe en la raíz del proyecto
2. Verificar que contiene las variables: `AUTH_URL`, `CLIENT_ID`, `CLIENT_SECRET`
3. Asegurarse de que los valores no estén vacíos
4. Si ejecutas k6 directamente (sin npm), pasar las variables como variables de entorno del sistema

### Error: Connection timeout
```
⚠️ Error de servidor: 504 - Gateway Timeout
```
**Solución:** Sistema bajo demasiada carga, reducir usuarios o aumentar timeout

### Error: Rate limit
```
⏳ Rate limit alcanzado: 429
```
**Solución:** Sistema tiene límite de requests, documentar el threshold

### Error: InfluxDB connection refused
```
ERRO Couldn't write stats error="Post \"http://localhost:8086/write?...\": dial tcp [::1]:8086: connect: connection refused"
```
**Solución:** 
- Estos errores no afectan la ejecución de la prueba, solo indican que InfluxDB no está corriendo
- Los resultados se muestran en consola de todas formas
- Si no necesitas InfluxDB, ejecuta sin `--out influxdb`:
  ```bash
  ./load-tests/scripts/run-k6.sh load-test.js
  ```
- Si necesitas InfluxDB, instálalo y ejecútalo primero:
  ```bash
  # Con Docker
  docker run -d -p 8086:8086 influxdb:1.8
  
  # O instala InfluxDB localmente según tu sistema operativo
  ```

---

## Comandos Útiles

```bash
# Ver versión de k6
k6 version

# Ejecutar con dashboard web interactivo (RECOMENDADO)
K6_WEB_DASHBOARD=true ./load-tests/scripts/run-k6.sh load-test.js
# Luego abre: http://localhost:5665

# Ejecutar con más logs
./load-tests/scripts/run-k6.sh load-test.js --verbose

# Ejecutar con menos usuarios (debug)
./load-tests/scripts/run-k6.sh load-test.js --vus 5 --duration 30s

# Generar reporte JSON
./load-tests/scripts/run-k6.sh load-test.js --out json=load-tests/reports/results.json

# Ver métricas en tiempo real (dashboard local con InfluxDB)
./load-tests/scripts/run-k6.sh load-test.js --out influxdb=http://localhost:8086

# Ejecutar directamente con k6 (sin wrapper, requiere variables de entorno)
AUTH_URL=... CLIENT_ID=... CLIENT_SECRET=... k6 run --verbose load-tests/scripts/load-test.js
```

---

## Mejores Prácticas

1. **Ejecutar en horarios de baja carga** para no afectar usuarios reales
2. **Coordinar con DevOps** antes de pruebas de estrés
3. **Monitorear el servidor** durante las pruebas (CPU, memoria, red)
4. **Documentar todos los resultados** para análisis histórico
5. **Incrementar carga gradualmente** para identificar límites precisos
6. **Usar datos de prueba específicos** que no afecten datos reales

---

## Referencias

- [Documentación oficial de k6](https://k6.io/docs/)
- [Best practices para load testing](https://k6.io/docs/testing-guides/load-testing/)
- [Métricas de k6 explicadas](https://k6.io/docs/using-k6/metrics/)

