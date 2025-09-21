# Configuration Email - Instructions

## Configuration Gmail (Recommandée pour les tests)

1. **Activez l'authentification à 2 facteurs** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans les paramètres de votre compte Google
   - Sécurité → Authentification à 2 facteurs → Mots de passe d'application
   - Générez un nouveau mot de passe pour "Mail"
3. **Modifiez le fichier `.env`** :
   ```
   EMAIL_USER=votre-email@gmail.com
   EMAIL_PASSWORD=le-mot-de-passe-application-genere
   EMAIL_FROM=SkyLume <votre-email@gmail.com>
   ```

## Configuration Resend (Recommandée pour la production)

1. **Créez un compte sur** [resend.com](https://resend.com)
2. **Obtenez votre clé API**
3. **Modifiez le fichier `.env`** :
   ```
   RESEND_API_KEY=re_votre_cle_api_ici
   EMAIL_FROM=SkyLume <noreply@votredomaine.com>
   ```

## Configuration Brevo (Sendinblue)

1. **Créez un compte sur** [brevo.com](https://brevo.com)
2. **Obtenez votre clé API SMTP**
3. **Modifiez le fichier `.env`** :
   ```
   BREVO_API_KEY=votre-cle-api-brevo
   BREVO_USER=votre-email@domaine.com
   EMAIL_FROM=SkyLume <noreply@votredomaine.com>
   ```

## Test de la configuration

1. **Démarrez le serveur** :
   ```bash
   cd server
   npm run dev
   ```

2. **Testez l'envoi d'email** via l'application web

3. **Vérifiez les logs** pour voir si l'email a été envoyé avec succès

## Notes importantes

- Le fichier `.env` ne doit jamais être commité dans Git (il est dans .gitignore)
- Pour la production, utilisez des services comme Resend, Brevo ou Mailgun
- Gmail peut limiter l'envoi d'emails, utilisez-le uniquement pour les tests