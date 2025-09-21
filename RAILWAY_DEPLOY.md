# 🚀 Guide de Déploiement Railway pour SkyCore

Railway est la méthode recommandée pour déployer SkyCore : simple, rapide et gratuit pour commencer !

## 🎯 Pourquoi Railway ?

✅ **Simplicité** - Déploiement en quelques clics  
✅ **Auto-détection** - Reconnaît automatiquement Node.js et React  
✅ **Git Deploy** - Déploiement automatique depuis GitHub  
✅ **SSL gratuit** - HTTPS automatique  
✅ **Domaines** - URLs personnalisables  
✅ **Base de données** - PostgreSQL gratuit inclus  

## 📋 Pré-requis

1. **Compte GitHub** avec votre code SkyCore
2. **Compte Railway** (gratuit) → [railway.app](https://railway.app)
3. **Clé API Resend** pour l'envoi d'emails

## 🚀 Déploiement étape par étape

### 1. Préparer le code

Le code est déjà configuré pour Railway avec :
- `railway.json` - Configuration Railway
- `nixpacks.toml` - Build configuration
- Scripts de build optimisés

### 2. Créer un projet Railway

1. **Connectez-vous** sur [railway.app](https://railway.app)
2. **Cliquez** sur "New Project"
3. **Sélectionnez** "Deploy from GitHub repo"
4. **Autorisez** Railway à accéder à vos repos
5. **Choisissez** votre repository SkyCore

### 3. Configurer les services

Railway va détecter automatiquement deux services :

#### 🖥️ **Service Serveur (Backend)**
- **Dossier** : `server/`
- **Type** : Node.js
- **Port** : 3001 (auto-détecté)

#### 🌐 **Service Client (Frontend)**  
- **Dossier** : `client/`
- **Type** : React/Vite
- **Port** : 3000 (auto-détecté)

### 4. Variables d'environnement

#### Pour le **SERVEUR** :
```env
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/database/skycore.db
RESEND_API_KEY=re_votre_cle_api_resend
EMAIL_FROM=SkyLume <noreply@votre-domaine.com>
```

#### Pour le **CLIENT** :
```env
VITE_API_URL=https://votre-serveur-railway-url.up.railway.app
```

### 5. Configuration détaillée

1. **Dans Railway Dashboard** :
   - Cliquez sur votre service "server"
   - Onglet "Variables" 
   - Ajoutez les variables d'environnement une par une

2. **Pour le client** :
   - Cliquez sur votre service "client"
   - Variables → Ajouter `VITE_API_URL`
   - Utilisez l'URL générée par Railway pour le serveur

### 6. Déploiement automatique

✅ Railway va automatiquement :
1. **Détecter** les changements sur GitHub
2. **Builder** les deux services
3. **Déployer** en production
4. **Générer** des URLs publiques

## 🌐 URLs finales

Après déploiement, vous aurez :
- **Frontend** : `https://votre-client-hash.up.railway.app`
- **Backend API** : `https://votre-serveur-hash.up.railway.app`

## 🎨 Configuration avancée

### Domaines personnalisés

1. **Dans Railway** → Settings → Domains
2. **Ajouter** votre domaine
3. **Configurer** les DNS chez votre registraire

### Base de données PostgreSQL (optionnel)

Pour une production robuste :

1. **Ajouter PostgreSQL** : New → Database → PostgreSQL
2. **Récupérer DATABASE_URL** depuis les variables Railway
3. **Modifier le serveur** pour utiliser PostgreSQL au lieu de SQLite

### Monitoring et logs

- **Logs temps réel** : Onglet "Logs" de chaque service
- **Métriques** : CPU, RAM, trafic automatiquement trackés
- **Alertes** : Configuration possible via Railway

## 💰 Coûts

### Plan gratuit (Hobby)
- **500h/mois** d'usage
- **1GB RAM** par service
- **1GB stockage**
- **100GB** de bande passante

### Plan Pro ($5/mois)
- **Ressources illimitées**
- **Domaines personnalisés**
- **Support prioritaire**

## 🔧 Commandes utiles

### Développement local
```bash
# Client
cd client && npm run dev

# Serveur  
cd server && npm run dev
```

### CLI Railway (optionnel)
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy depuis CLI
railway up
```

## 🐛 Dépannage

### Build qui échoue
```bash
# Vérifier les logs dans Railway Dashboard
# Onglet "Deployments" → Cliquer sur le build en erreur
```

### Variables manquantes
```bash
# Vérifier dans Railway → Service → Variables
# S'assurer que toutes les variables sont définies
```

### API non accessible
```bash
# Vérifier que VITE_API_URL pointe vers la bonne URL Railway
# Format: https://votre-service-hash.up.railway.app
```

### Emails non envoyés
```bash
# Vérifier RESEND_API_KEY dans les variables
# Vérifier les logs du serveur pour les erreurs d'auth
```

## 📊 Avantages Railway vs autres solutions

| Critère | Railway | Vercel | Heroku | Docker |
|---------|---------|--------|--------|--------|
| **Simplicité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Coût** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Full-stack** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Auto-scaling** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Base de données** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## 🎉 Conclusion

Railway est **parfait pour SkyCore** car :
- Configuration zero-effort
- Support natif Node.js + React  
- Base de données intégrée
- SSL et domaines automatiques
- Prix attractif

**Temps estimé de déploiement : 15 minutes** ⏱️

Votre application sera en ligne avec une URL publique, SSL activé et prête à être utilisée !

## 📞 Support

- **Documentation Railway** : [docs.railway.app](https://docs.railway.app)
- **Community Discord** : [discord.gg/railway](https://discord.gg/railway)
- **Status page** : [status.railway.app](https://status.railway.app)