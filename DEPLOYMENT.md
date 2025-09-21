# 🚀 Guide de Déploiement Docker + Traefik pour SkyCore

Ce guide vous explique comment déployer SkyCore en production avec Docker Compose et Traefik.

## 📋 Pré-requis

- **Serveur Linux** (Ubuntu 20.04+ recommandé)
- **Docker** et **Docker Compose** installés
- **Nom de domaine** pointant vers votre serveur
- **Ports 80 et 443** ouverts sur votre serveur

## 🔧 Configuration

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/skycore.git
cd skycore
```

### 2. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example.production .env

# Éditer avec vos valeurs
nano .env
```

Configurez ces variables dans `.env` :

```env
# Email Configuration (Resend recommandé)
RESEND_API_KEY=re_votre_cle_api_resend
EMAIL_FROM=SkyLume <noreply@votre-domaine.com>

# Domaine de production
DOMAIN=votre-domaine.com

# Email pour Let's Encrypt
ACME_EMAIL=votre-email@example.com
```

### 3. Mettre à jour les domaines dans docker-compose.yml

Remplacez `votre-domaine.com` par votre vrai domaine dans :
- `docker-compose.yml` 
- Les labels Traefik

## 🚀 Déploiement

### Déploiement automatique

```bash
./deploy.sh
```

### Déploiement manuel

```bash
# Construire et démarrer
docker-compose up -d --build

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

## 📊 Services Déployés

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | `https://votre-domaine.com` | Application React |
| **API** | `https://votre-domaine.com/api` | Backend Node.js |
| **Traefik Dashboard** | `https://traefik.votre-domaine.com` | Monitoring Traefik |

## 🔐 Sécurité

### SSL/TLS
- **Certificats automatiques** via Let's Encrypt
- **Redirection HTTP → HTTPS** automatique
- **Renouvellement automatique** des certificats

### Dashboard Traefik
- **Authentification basique** (admin/admin par défaut)
- **Changez le mot de passe** en production

### Headers de sécurité
- X-Frame-Options, X-Content-Type-Options
- CORS configuré pour l'API

## 📁 Volumes Persistants

```bash
# Base de données SQLite
docker volume inspect skycore_server-data

# Images générées
docker volume inspect skycore_server-images

# Certificats Let's Encrypt
docker volume inspect skycore_traefik-acme
```

## 🔄 Gestion

### Logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f traefik
```

### Redémarrage
```bash
# Tous les services
docker-compose restart

# Service spécifique
docker-compose restart server
```

### Mise à jour
```bash
# Récupérer les dernières modifications
git pull

# Reconstruire et redéployer
docker-compose down
docker-compose up -d --build
```

### Sauvegarde
```bash
# Sauvegarder la base de données
docker-compose exec server cp /app/database/skycore.db /tmp/
docker cp $(docker-compose ps -q server):/tmp/skycore.db ./backup-$(date +%Y%m%d).db

# Sauvegarder les volumes
docker run --rm -v skycore_server-data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz -C /data .
```

## 🐛 Dépannage

### Problèmes courants

**1. Certificat SSL non généré**
```bash
# Vérifier les logs Traefik
docker-compose logs traefik

# Vérifier que le domaine pointe vers le serveur
nslookup votre-domaine.com
```

**2. Base de données non accessible**
```bash
# Vérifier les permissions du volume
docker-compose exec server ls -la /app/database/
```

**3. Images non sauvegardées**
```bash
# Vérifier le volume images
docker-compose exec server ls -la /app/images/
```

### Commandes utiles

```bash
# État détaillé des containers
docker-compose ps
docker stats

# Espace disque
docker system df

# Nettoyer les images inutilisées
docker system prune -a
```

## 📈 Monitoring

### Métriques Traefik
- Dashboard disponible sur `https://traefik.votre-domaine.com`
- Métriques de performance et santé

### Logs d'application
- Logs structurés pour le debugging
- Rotation automatique des logs

## 🔧 Configuration Avancée

### Scaling horizontal
```bash
# Plusieurs instances du serveur
docker-compose up -d --scale server=3
```

### Base de données externe
Pour une production avancée, considérez :
- PostgreSQL externe
- Redis pour le cache
- MinIO pour le stockage d'images

### Backup automatisé
Configurez un cron job pour les sauvegardes :
```bash
# Crontab exemple (sauvegarde quotidienne à 2h)
0 2 * * * /path/to/skycore/backup.sh
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs avec `docker-compose logs -f`
2. Consultez la documentation Docker et Traefik
3. Ouvrez une issue sur le repository GitHub