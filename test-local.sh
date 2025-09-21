#!/bin/bash

# Script de test local pour SkyCore
set -e

echo "🧪 Test local de SkyCore avec Docker Compose"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé."
    exit 1
fi

echo "✅ Pré-requis vérifiés"

# Arrêter les services existants
echo "🛑 Arrêt des services existants..."
docker-compose -f docker-compose.local.yml down --remove-orphans

# Construire et démarrer en mode local
echo "🔨 Construction et démarrage..."
docker-compose -f docker-compose.local.yml up -d --build

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage..."
sleep 15

# Vérifier le statut
echo "📊 Statut des services:"
docker-compose -f docker-compose.local.yml ps

echo ""
echo "✅ Test local terminé !"
echo ""
echo "🌐 URLs de test:"
echo "   - Frontend: http://localhost"
echo "   - API: http://localhost/api"
echo "   - Dashboard Traefik: http://localhost:8080"
echo ""
echo "📝 Pour voir les logs:"
echo "   docker-compose -f docker-compose.local.yml logs -f"
echo ""
echo "🛑 Pour arrêter:"
echo "   docker-compose -f docker-compose.local.yml down"