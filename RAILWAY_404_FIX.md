# Résolution des erreurs 404 sur Railway

## Problème identifié
Les erreurs 404 étaient dues au fait que Railway tentait de servir l'application React séparément du serveur Express, mais les deux n'étaient pas correctement connectés.

## Solution implémentée

### 1. Configuration unifiée
- **Un seul service Railway** : Le serveur Express sert maintenant les fichiers React statiques
- **Build script unifié** : `build.sh` compile le client ET le serveur
- **Configuration Railway mise à jour** : `server/railpack-plan.json` utilise le nouveau script

### 2. Modifications apportées

#### `server/index.js`
```javascript
// Serve React build files
app.use(express.static(path.join(__dirname, 'dist')))

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes or static files
  if (req.path.startsWith('/api/') || req.path.startsWith('/images/')) {
    return res.status(404).json({ error: 'Not found' })
  }
  
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err)
      res.status(404).json({ error: 'Page not found' })
    }
  })
})
```

#### `build.sh` (nouveau script)
- Installe les dépendances du serveur
- Build l'application React 
- Copie le build React dans le dossier `server/dist`

#### `server/railpack-plan.json`
```json
{
  "buildCommand": "../build.sh",
  "startCommand": "node index.js"
}
```

## Instructions de redéploiement sur Railway

### Option 1: Nouveau service (Recommandé)
1. **Supprimez les anciens services** client et serveur sur Railway
2. **Créez UN SEUL nouveau service** depuis le dossier `server/`
3. Railway détectera automatiquement `railpack-plan.json`
4. Le build se fera automatiquement avec notre script

### Option 2: Modifier le service existant
1. **Gardez seulement le service serveur** sur Railway
2. **Supprimez le service client**
3. **Redéployez** le service serveur

## Vérification post-déploiement

### URLs à tester :
- `https://votre-app.railway.app/` → Interface React ✅
- `https://votre-app.railway.app/api/skyscore` → API backend ✅
- `https://votre-app.railway.app/health` → Health check ✅

### Plus d'erreurs 404 pour :
- `GET /` → Sert maintenant `index.html`
- `GET /@vite/env` → Géré par le catch-all
- `GET /actutor/env` → Retourne 404 JSON proprement
- `GET /.vscode/sftp.json` → Bloqué par la logique
- `GET /.env` → Sécurisé, retourne 404
- `GET /.git/config` → Sécurisé, retourne 404

## Avantages de cette solution
- ✅ **Un seul service Railway** = plus simple et moins cher
- ✅ **Sécurité améliorée** : fichiers sensibles protégés
- ✅ **Performance optimisée** : serveur unique
- ✅ **Routing SPA correct** : support des routes React
- ✅ **API et frontend unifiés** : même domaine, plus de CORS

## Variables d'environnement Railway
Assurez-vous que ces variables sont configurées sur Railway :
```
NODE_ENV=production
PORT=3001
RESEND_API_KEY=votre_clé_resend
```

---

🎯 **Action suivante :** Redéployez en utilisant UN SEUL service Railway pointant vers le dossier `server/`