# Dockerfile pour le serveur Node.js
FROM node:18-alpine

# Installation des dépendances système pour Canvas et SQLite
RUN apk add --no-cache \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    python3 \
    make \
    g++

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Créer le répertoire pour les images et la base de données
RUN mkdir -p /app/images /app/database

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/database/skycore.db

# Démarrer l'application
CMD ["node", "index.js"]