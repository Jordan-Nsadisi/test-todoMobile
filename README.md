# TodoApp Mobile

Application mobile de gestion de tâches développée avec React Native et Expo, connectée à une API Laravel.

## Prérequis

- **Node.js** (v18 ou supérieur)
- **npm** ou **yarn**
- **Backend Laravel** démarré et accessible
- **Expo Go** (pour tester sur mobile) ou émulateur Android/iOS

## Installation

1. **Cloner le projet**
   ```bash
   cd test-todoMobile
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'API**
   
   Modifier l'URL de l'API dans `src/services/api.ts` :
   ```typescript
   const API_BASE_URL = 'http://votre-ip:8000/api';
   ```

## Lancement

### Démarrer le serveur de développement
```bash
npm start
```

### Lancer sur une plateforme spécifique
```bash
# Web
npm run web

# Android
npm run android

# iOS
npm run ios
```

## Technologies

- **React Native** avec **Expo Router** (navigation file-based)
- **TypeScript** (typage strict)
- **Zustand** (gestion d'état authentification)
- **TanStack Query** (gestion des données serveur)
- **React Hook Form** (gestion des formulaires)
- **Axios** (client HTTP)

---

Développé avec ❤️ par Jordan Nsadisi
