#!/bin/bash

echo "🔍 Diagnóstico de servicios del devcontainer..."
echo "=============================================="

# Verificar si estamos en un devcontainer
if [ -n "$CODESPACE_NAME" ]; then
    echo "✅ Ejecutándose en GitHub Codespaces"
    echo "📦 Codespace: $CODESPACE_NAME"
elif [ -n "$REMOTE_CONTAINERS" ]; then
    echo "✅ Ejecutándose en VS Code Remote Containers"
else
    echo "⚠️  No se detectó entorno de devcontainer"
fi

echo ""
echo "🌐 Verificando conectividad de servicios..."
echo "-------------------------------------------"

# Verificar PostgreSQL
if ping -c 1 db >/dev/null 2>&1; then
    echo "✅ PostgreSQL (db): Accesible"
    if nc -z db 5432 2>/dev/null; then
        echo "✅ PostgreSQL Puerto 5432: Abierto"
    else
        echo "❌ PostgreSQL Puerto 5432: Cerrado"
    fi
else
    echo "❌ PostgreSQL (db): No accesible"
fi

# Verificar Keycloak
if ping -c 1 keycloak >/dev/null 2>&1; then
    echo "✅ Keycloak: Accesible"
    if nc -z keycloak 8080 2>/dev/null; then
        echo "✅ Keycloak Puerto 8080: Abierto"
    else
        echo "❌ Keycloak Puerto 8080: Cerrado"
    fi
else
    echo "❌ Keycloak: No accesible"
fi

echo ""
echo "🔧 Información del sistema..."
echo "----------------------------"
echo "🐳 Docker disponible: $(which docker >/dev/null && echo "Sí" || echo "No")"
echo "🐙 Docker Compose disponible: $(which docker-compose >/dev/null && echo "Sí" || echo "No")"

# Verificar puertos
echo ""
echo "🔌 Puertos locales abiertos..."
echo "-----------------------------"
netstat -tuln 2>/dev/null | grep -E ":3000|:5432|:6006|:8080" || echo "No se encontraron puertos de servicios abiertos"

echo ""
echo "💡 Recomendaciones:"
echo "-------------------"
if ! ping -c 1 db >/dev/null 2>&1; then
    echo "• Los servicios auxiliares no están ejecutándose"
    echo "• Esto puede deberse a limitaciones de recursos en Codespaces"
    echo "• Considera usar servicios externos o configurar alternativas locales"
fi

echo ""
echo "🔄 Para reiniciar el devcontainer:"
echo "  - Ctrl+Shift+P → 'Codespaces: Rebuild Container'"
echo "  - O usa 'Rebuild and Reopen in Container' desde VS Code"
