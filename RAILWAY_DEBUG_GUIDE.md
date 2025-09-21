# 🔧 Résolution "Page not found" sur Railway

## 🚨 Problème
L'erreur `{"error":"Page not found"}` indique que le serveur Express ne trouve pas le fichier `index.html` de React dans le dossier `dist`.

## 🔍 Diagnostic
Utilisez cette route de debug pour voir l'état du système de fichiers sur Railway :
```
https://votre-app.railway.app/debug/files
```

Cette route vous montrera :
- Le répertoire de travail actuel
- Les fichiers présents dans le dossier serveur
- Si le dossier `dist` existe
- Le contenu du dossier `dist` s'il existe

## 🛠️ Solutions par ordre de priorité

### 1. ⚡ Solution rapide : Vérifier le build Railway
Sur Railway, vérifiez les **logs de build** pour voir si le script `build.sh` s'exécute correctement :

1. Allez dans votre projet Railway
2. Cliquez sur l'onglet **"Deployments"**
3. Cliquez sur le dernier déploiement
4. Regardez les **logs de build**

**Recherchez ces messages :**
- ✅ `Building Skycore application...`
- ✅ `Installing server dependencies...`
- ✅ `Building React client...`
- ✅ `Files in client/dist:`
- ✅ `Copying client build to server...`
- ✅ `Build completed successfully!`

### 2. 🔧 Correction de configuration Railway

Si le build échoue, voici les corrections possibles :

#### A. Vérifier la racine du service
- **Problème** : Railway pointe vers la racine au lieu du dossier `server/`
- **Solution** : Configurez Railway pour pointer vers `server/` comme racine

#### B. Corriger le chemin du script build
Si Railway ne trouve pas `build.sh`, modifiez `server/railpack-plan.json` :

```json
{
  "providers": ["node"],
  "buildCommand": "chmod +x ../build.sh && ../build.sh",
  "startCommand": "node index.js",
  "variables": {
    "NODE_ENV": "production",
    "PORT": "3001"
  },
  "packages": [
    "build-essential",
    "libcairo2-dev",
    "libpango1.0-dev",
    "libjpeg-dev",
    "libgif-dev",
    "librsvg2-dev",
    "libpixman-1-dev",
    "pkg-config",
    "python3",
    "make",
    "g++"
  ]
}
```

#### C. Alternative : Build inline
Si le script externe ne fonctionne pas, utilisez un build inline :

```json
{
  "providers": ["node"],
  "buildCommand": "npm ci --omit=dev && cd ../client && npm ci && npm run build && cp -r dist ../server/dist",
  "startCommand": "node index.js"
}
```

### 3. 🔄 Solution alternative : Déploiement unifié

Si le problème persiste, créez un déploiement unifié depuis la racine :

#### Créer `railpack-plan.json` à la racine :
```json
{
  "providers": ["node"],
  "buildCommand": "./build.sh",
  "startCommand": "cd server && node index.js",
  "variables": {
    "NODE_ENV": "production",
    "PORT": "3001"
  },
  "packages": [
    "build-essential",
    "libcairo2-dev",
    "libpango1.0-dev",
    "libjpeg-dev",
    "libgif-dev",
    "librsvg2-dev",
    "libpixman-1-dev",
    "pkg-config",
    "python3",
    "make",
    "g++"
  ]
}
```

## 🧪 Test local
Avant de redéployer, testez toujours localement :

```bash
# Nettoyer et rebuilder
rm -rf server/dist
./build.sh

# Vérifier que les fichiers existent
ls -la server/dist/

# Tester le serveur
cd server && node index.js
```

Puis testez :
- `http://localhost:3001/` → Interface React
- `http://localhost:3001/debug/files` → Diagnostic

## 🎯 Checklist de résolution

- [ ] **Logs Railway** : Vérifier que `build.sh` s'exécute sans erreur
- [ ] **Route debug** : Accéder à `/debug/files` pour voir l'état des fichiers
- [ ] **Configuration** : S'assurer que Railway pointe vers le bon dossier
- [ ] **Permissions** : Vérifier que `build.sh` est exécutable
- [ ] **Chemins** : Vérifier que les chemins relatifs sont corrects
- [ ] **Test local** : Reproduire le build localement

## 🆘 Support d'urgence

Si rien ne fonctionne, voici une solution de contournement rapide :

1. **Construisez localement** : `./build.sh`
2. **Zippez le serveur** : `tar -czf server-with-dist.tar.gz server/`
3. **Uploadez manuellement** sur Railway
4. **Configurez Railway** pour utiliser seulement `"startCommand": "node index.js"`

---

**📞 Une fois résolu, supprimez la route `/debug/files` pour la sécurité !**