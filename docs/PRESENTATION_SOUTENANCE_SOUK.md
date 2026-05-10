# Presentation professionnelle - Projet SOUK

Ce document accompagne `presentation_soutenance_souk.html`. Il est adapte a une soutenance universitaire ou a un pitch de projet web.

## 1. Introduction du projet

**Nom du projet :** SOUK  
**Type :** Web application SaaS e-commerce

SOUK est une marketplace multi-boutique dediee aux artisans, createurs et vendeurs marocains. Le projet permet a un vendeur de creer une boutique en ligne, presenter ses produits, recevoir des commandes et suivre son activite commerciale.

Dans le contexte marocain, beaucoup de petites activites ont besoin de visibilite digitale, mais n'ont pas toujours les ressources techniques pour creer une solution e-commerce complete. SOUK repond a ce besoin local avec une plateforme claire, moderne et evolutive.

## 2. Problematique

Le probleme principal est la difficulte pour les vendeurs locaux de passer d'une activite traditionnelle ou dispersee vers une activite digitale organisee.

Beaucoup utilisent les reseaux sociaux, les messages ou les appels pour vendre. Ces canaux peuvent aider a communiquer, mais ils ne suffisent pas pour suivre le stock, structurer les commandes, gerer les clients et donner une experience professionnelle.

La question centrale est donc :

**Comment permettre a un vendeur marocain de creer une boutique en ligne, gerer ses produits, recevoir des commandes et communiquer avec ses clients dans une seule application ?**

Ce projet est important aujourd'hui car le commerce local a besoin d'outils numeriques accessibles, fiables et adaptes au marche marocain.

## 3. Objectifs

### Objectif principal

Developper une application web professionnelle qui permet aux vendeurs marocains de creer leur presence digitale, vendre leurs produits et gerer leur activite depuis un espace centralise.

### Objectifs secondaires

- Creer des espaces distincts pour client, vendeur et administrateur.
- Mettre en place un catalogue produit clair.
- Automatiser le suivi des commandes et du stock.
- Faciliter la communication client-vendeur.
- Securiser les routes avec JWT et RBAC.
- Construire une API REST maintenable.
- Structurer la base de donnees autour des entites metier.
- Preparer une evolution vers une version production.

### Impact attendu

Pour les vendeurs, SOUK apporte plus d'autonomie, une meilleure organisation et une meilleure visibilite.

Pour les clients, la plateforme offre un parcours d'achat plus clair, plus rapide et plus rassurant.

Pour le marche local, elle contribue a valoriser le commerce marocain et le savoir-faire local.

## 4. Fonctionnement du projet

### Architecture generale

Le projet suit une architecture separee :

- **Frontend :** React.js avec Vite pour construire les interfaces utilisateur.
- **Backend :** Laravel 11 pour gerer la logique metier, l'authentification, les validations et les API.
- **Base de donnees :** MySQL ou SQLite selon l'environnement, avec migrations Laravel.

Le frontend communique avec le backend via une API REST. Le backend controle les donnees, les droits d'acces et les operations sensibles.

### Parcours utilisateur

1. Le client arrive sur la page d'accueil.
2. Il explore la marketplace.
3. Il consulte une page produit.
4. Il ajoute un produit au panier et passe commande.
5. Le vendeur recoit la commande dans son dashboard.
6. Le vendeur traite la commande et suit son stock.
7. L'administrateur supervise les comptes, les roles et les activites sensibles.

### Logique fonctionnelle

L'application repose sur plusieurs modules :

- Authentification JWT.
- Roles et permissions.
- Catalogue produits.
- Panier et checkout.
- Commandes avec controle du stock.
- Commissions.
- Chat client-vendeur.
- Notifications.
- Dashboard vendeur.
- Administration.

### Explication technique simplifiee

Le client interagit avec l'interface React. Les actions importantes, comme la connexion, la creation d'une commande ou la mise a jour d'un produit, sont envoyees au backend Laravel. Laravel valide les donnees, applique les regles metier et met a jour la base de donnees.

## 5. Maquettes / Pages du site

Les images des maquettes sont des captures internes du projet, stockees dans `docs/annexes`. Elles ne proviennent pas d'internet.

### Page 1 - Home / Accueil

**Image :** `docs/annexes/page_accueil.png`

La page d'accueil presente SOUK, son identite et son positionnement comme marketplace marocaine.

Sur le plan UX/UI, elle utilise un style elegant avec des couleurs inspirees du luxe marocain. Le visuel principal et la hierarchie du contenu guident l'utilisateur vers la decouverte de la plateforme.

Son role est de creer la confiance, expliquer rapidement la valeur du projet et orienter l'utilisateur vers l'exploration.

### Page 2 - Login client

**Image :** `docs/annexes/client_login.png`

Cette page permet au client de se connecter a son compte personnel.

L'interface est centree sur l'action principale : acceder a son espace. Le formulaire reste simple et lisible pour reduire la friction.

Son role est de securiser l'acces aux commandes, notifications et conversations du client.

### Page 3 - Login vendeur

**Image :** `docs/annexes/vendor_login.png`

Cette page est dediee aux vendeurs. Elle permet d'acceder a l'espace professionnel.

L'interface separe clairement le parcours vendeur du parcours client. Cela evite la confusion et permet a chaque profil d'avoir un espace adapte.

Son role est de donner acces au dashboard, a la gestion des produits et au suivi des commandes.

### Page 4 - Marketplace / Explore

**Image :** `docs/annexes/explore.png`

Cette page permet au client de decouvrir les boutiques et les produits disponibles.

L'interface repose sur des cartes, une navigation visuelle et une organisation qui facilite la lecture rapide des produits.

Son role est de connecter les clients aux vendeurs et de declencher le parcours d'achat.

### Page 5 - Page produit

**Image :** `docs/annexes/page_produit.png`

La page produit presente un article en detail avant l'achat.

Elle met en avant le visuel, le nom, la description, le prix et l'action d'achat. L'ergonomie reduit l'effort de decision pour le client.

Son role est de transformer l'interet du client en intention de commande.

### Page 6 - Dashboard vendeur

**Image :** `docs/annexes/dashboard_vendeur.png`

Le dashboard vendeur est l'espace de pilotage de la boutique.

Il affiche les ventes, les commandes, les produits et les indicateurs importants. L'interface est orientee action et consultation quotidienne.

Son role est d'ameliorer l'autonomie du vendeur et de faciliter la gestion commerciale.

### Page 7 - Admin Panel

**Image :** `docs/annexes/admin_panel.png`

L'Admin Panel est l'interface de supervision de la plateforme.

Elle contient les statistiques, la moderation, la gestion des roles, les permissions et les actions sensibles.

Son role est de garantir la gouvernance, la securite et la qualite d'une marketplace multi-vendeur.

## 6. Technologies utilisees

### Frontend

- React.js
- Vite
- React Router
- Context API
- Axios
- CSS

### Backend

- Laravel 11
- PHP
- API REST
- Eloquent ORM
- Form Requests
- Services metier

### Base de donnees

- MySQL pour une production possible
- SQLite pour les tests
- Migrations Laravel

### Outils de developpement

- GitHub
- VS Code
- Postman
- Figma
- JWT
- RBAC
- Documentation Markdown

## 7. Analyse professionnelle

### Points forts

- Solution adaptee au marche marocain.
- Parcours complet client, vendeur et administrateur.
- Architecture claire et evolutive.
- Gestion des roles et permissions.
- Dashboard vendeur oriente productivite.
- Commande avec controle du stock.
- Chat et notifications pour la relation client.

### Innovations

SOUK n'est pas seulement une vitrine. C'est un ecosysteme qui centralise boutique, produits, commandes, chat et administration.

L'approche SaaS permet au vendeur d'utiliser une solution prete a l'emploi sans devoir creer son propre site.

### Valeur ajoutee

Pour les vendeurs, SOUK apporte plus d'autonomie et de visibilite.

Pour les clients, elle propose une experience plus fluide et plus professionnelle.

Pour l'administration, elle permet de superviser les activites et de garder un controle sur la qualite de la plateforme.

### Comparaison avec les solutions existantes

Les reseaux sociaux offrent de la visibilite, mais ils sont limites pour le suivi du stock, les commandes et l'organisation commerciale.

Les sites e-commerce classiques peuvent etre puissants, mais ils sont souvent couteux ou complexes pour les petits vendeurs.

SOUK propose une alternative specialisee, accessible et adaptee au contexte marocain.

## 8. Conclusion

SOUK est une application web e-commerce qui regroupe marketplace, boutiques vendeur, catalogue, commandes, chat, notifications, dashboard et administration.

Le projet repond a un besoin concret : aider les artisans et vendeurs marocains a digitaliser leur activite et a mieux organiser leurs ventes.

### Impact attendu

Au Maroc, SOUK peut contribuer a la digitalisation du commerce local, a la valorisation du savoir-faire marocain et a la creation de nouvelles opportunites commerciales.

### Perspectives futures

- Paiement en ligne.
- Gestion de la livraison par zone.
- Chat temps reel.
- Application mobile.
- Analytics avances.
- Intelligence artificielle pour descriptions produits, recommandations et recherche intelligente.
- Optimisation de la performance et de la scalabilite.

En conclusion, SOUK constitue une base solide pour une solution commerciale evolutive, moderne et adaptee au marche marocain.
