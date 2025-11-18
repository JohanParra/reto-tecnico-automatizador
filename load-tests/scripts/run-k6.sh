#!/bin/bash

# Script para ejecutar k6 con variables de entorno desde .env
# Uso: ./run-k6.sh load-test.js [opciones adicionales de k6]

# Obtener el directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
ENV_FILE="$PROJECT_ROOT/.env"

# Verificar que existe el archivo .env
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: No se encontró el archivo .env en $PROJECT_ROOT"
    echo "💡 Crea un archivo .env con las variables necesarias:"
    echo "   AUTH_URL=..."
    echo "   CLIENT_ID=..."
    echo "   CLIENT_SECRET=..."
    exit 1
fi

# Cargar variables de entorno desde .env
# Esto ignora comentarios y líneas vacías
export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs)

# Verificar variables requeridas
if [ -z "$AUTH_URL" ] || [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Error: Faltan variables de entorno requeridas en .env:"
    [ -z "$AUTH_URL" ] && echo "   - AUTH_URL"
    [ -z "$CLIENT_ID" ] && echo "   - CLIENT_ID"
    [ -z "$CLIENT_SECRET" ] && echo "   - CLIENT_SECRET"
    exit 1
fi

# Obtener el script de k6 (primer argumento)
K6_SCRIPT="$1"

if [ -z "$K6_SCRIPT" ]; then
    echo "❌ Error: Debes especificar el script de k6 a ejecutar"
    echo "Uso: $0 <script-k6.js> [opciones adicionales de k6]"
    exit 1
fi

# Construir la ruta completa del script
if [[ "$K6_SCRIPT" != /* ]]; then
    # Si es una ruta relativa, asumir que es relativa a load-tests/scripts/
    K6_SCRIPT="$SCRIPT_DIR/$K6_SCRIPT"
fi

# Verificar que el script existe
if [ ! -f "$K6_SCRIPT" ]; then
    echo "❌ Error: No se encontró el script: $K6_SCRIPT"
    exit 1
fi

# Obtener argumentos adicionales (todo después del primer argumento)
shift
K6_ARGS="$@"

# Ejecutar k6 con las variables de entorno cargadas
echo "🚀 Ejecutando k6 con variables de entorno desde .env..."
exec k6 run $K6_ARGS "$K6_SCRIPT"

