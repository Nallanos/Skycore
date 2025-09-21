#!/bin/bash

# Script de déploiement SkyCore avec Docker Compose et Traefik
set -e

echo "🚀 Déploiement de SkyCore avec Docker Compose + Traefik"

# Vérifier que Docker et Docker Compose sont installés
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Fichier .env manquant. Copiez .env.example.production vers .env et configurez vos valeurs."
    exit 1
fi

echo "✅ Pré-requis vérifiés"

# Arrêter les services existants
echo "🛑 Arrêt des services existants..."
docker-compose down --remove-orphans

# Construire les images
echo "🔨 Construction des images Docker..."
docker-compose build --no-cache

# Créer les volumes et réseaux
echo "📦 Création des volumes et réseaux..."
docker-compose up --no-start

# Initialiser les permissions pour Traefik
echo "🔧 Configuration des permissions Traefik..."
docker-compose run --rm traefik touch /acme.json
docker-compose run --rm traefik chmod 600 /acme.json

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier le statut
echo "📊 Statut des services:"
docker-compose ps

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🌐 Votre application est accessible sur:"
echo "   - Frontend: https://votre-domaine.com"
echo "   - API: https://votre-domaine.com/api"
echo "   - Dashboard Traefik: https://traefik.votre-domaine.com"
echo ""
echo "📝 Pour voir les logs:"
echo "   docker-compose logs -f"
echo ""
echo "🔄 Pour redémarrer:"
echo "   docker-compose restart"
echo ""
echo "🛑 Pour arrêter:"
echo "   docker-compose down"