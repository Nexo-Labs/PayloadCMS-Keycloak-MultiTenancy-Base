# Primera fase: Build del tema de Keycloak
FROM node:20-alpine AS builder

WORKDIR /app

# Instalo Maven y otras dependencias necesarias
RUN apk add --no-cache maven

# Copio archivos de configuración de dependencias
COPY package.json ./

# Instalo las dependencias con npm (más confiable en containers)
RUN npm install

# Copio el código fuente
COPY . .

# Construyo el tema de Keycloak
RUN npm run build-keycloak-theme

# Segunda fase: Imagen final de Keycloak
FROM quay.io/keycloak/keycloak:26.4.7

# Copio el tema construido desde la fase anterior
COPY --from=builder /app/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/keycloak-theme.jar