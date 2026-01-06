# Chat Room WebSocket - GIRARD Lucas - ESGI IW M2

## Fonctionnalités

- **Gestion des rooms** :
  - Rooms par défaut : Lobby, Support (pour admin), Room 1, Room 2, Room 3
  - Rejoindre/quitter des rooms
  - Cooldown des messages
  - Changer son pseudo
- **Messagerie en temps réel** : Envoi et réception de messages instantanés
- **Indicateur de frappe** : Voir quand un ou plusieurs utilisateurs est/sont en train d'écrire

## Installation

1. Clonez le repository :
   ```bash
   git clone https://github.com/calulazone/chat_room_final
   cd web-temps-reel-projet
   ```

2. Configurez les variables d'environnement :
   - Copiez le fichier `app/.env.example` vers `app/.env`
   - Modifiez les valeurs dans `app/.env`

3. Installez les modules :
   ```bash
   cd app
   npm i
   ```

4. Lancez le projet :
   ```bash
   docker compose up
   ```

5. Accédez à `http://localhost:3000`

Notes : C'est un peu long entre le docker et l'accès, je ne sais pas pourquoi

## Utilisation

1. Connectez-vous avec un des comptes :
   - **Admin** : n'importe quel username + password défini dans `.env`
   - **User** : n'importe quel username + 0 password

2. Rejoignez une room en cliquant dessus dans la liste

3. Envoyez des messages dans le chat