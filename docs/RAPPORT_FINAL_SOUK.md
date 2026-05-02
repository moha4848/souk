# RAPPORT DE PROJET DE SYNTHÈSE : SOUK ✦
*Plateforme SaaS E-commerce Multi-locataires pour l'artisanat et le commerce au Maroc*

**Réalisé par :** Akram Sabouni & Yousfi Mohammed

---

## SOMMAIRE
- [REMERCIEMENTS](#remerciements)
- [INTRODUCTION](#introduction)
- [1. PRÉSENTATION DU PROJET](#1-présentation-du-projet)
  - [1.1 Contexte du projet](#11-contexte-du-projet)
  - [1.2 Problématique](#12-problématique)
  - [1.3 Objectifs du projet](#13-objectifs-du-projet)
  - [1.4 Périmètre du système](#14-périmètre-du-système)
- [2. ANALYSE DES BESOINS](#2-analyse-des-besoins)
  - [2.1 Besoins fonctionnels](#21-besoins-fonctionnels)
  - [2.2 Besoins non fonctionnels & Budget](#22-besoins-non-fonctionnels--budget)
- [3. ÉTUDE DE L’EXISTANT](#3-étude-de-lexistant)
- [4. CONCEPTION DU SYSTÈME](#4-conception-du-système)
  - [4.1 Architecture générale](#41-architecture-générale)
  - [4.2 Diagramme de cas d’utilisation](#42-diagramme-de-cas-dutilisation)
  - [4.3 Diagramme de classes](#43-diagramme-de-classes)
  - [4.4 Modèle de données](#44-modèle-de-données)
  - [4.5 Diagramme de Séquence](#45-diagramme-de-séquence)
- [5. RÉALISATION DU PROJET](#5-réalisation-du-projet)
  - [5.1 Technologies et outils utilisés](#51-technologies-et-outils-utilisés)
  - [5.2 Architecture technique (Laravel / React)](#52-architecture-technique-laravel--react)
  - [5.3 Implémentation des fonctionnalités principales](#53-implémentation-des-fonctionnalités-principales)
  - [5.4 Intégration Technique de l'Intelligence Artificielle](#54-intégration-technique-de-lintelligence-artificielle)
  - [5.5 Flux de Paiement (Intégration Stripe / CMI)](#55-flux-de-paiement-intégration-stripe--cmi)
- [6. FONCTIONNALITÉS DU SYSTÈME](#6-fonctionnalités-du-système)
  - [6.1 Espace Administrateur](#61-espace-administrateur)
  - [6.2 Espace Vendeur](#62-espace-vendeur)
  - [6.3 Espace Client](#63-espace-client)
  - [6.4 Sécurité et Optimisation (SEO)](#64-sécurité-et-optimisation-seo)
- [7. TESTS ET VALIDATION](#7-tests-et-validation)
- [8. DIFFICULTÉS RENCONTRÉES ET SOLUTIONS](#8-difficultés-rencontrées-et-solutions)
- [9. PERSPECTIVES D’ÉVOLUTION](#9-perspectives-dévolution)
- [CONCLUSION](#conclusion)
- [ANNEXES](#annexes)

---

## REMERCIEMENTS
Nous tenons à exprimer notre profonde gratitude à notre professeure encadrante, **Professeure Amira**, pour son suivi académique, ses conseils précieux et son orientation tout au long de ce projet de synthèse. Nos remerciements s'étendent également au corps professoral et à toutes les personnes ayant contribué de près ou de loin à l'aboutissement de ce travail.

## INTRODUCTION
Dans une ère de forte numérisation, de nombreux artisans et créateurs marocains peinent à se faire une place en ligne. Le commerce électronique s'impose comme un canal incontournable, mais la transition numérique reste un défi majeur. Face à ce constat, le projet **SOUK ✦** a été conçu. SOUK est une plateforme SaaS (Logiciel en tant que Service) multi-locataires (Place de marché hybride), permettant à tout créateur de générer instantanément une boutique de commerce électronique luxueuse et personnalisée grâce à l'Intelligence Artificielle. Ce rapport détaille le processus de développement de cette solution.

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte du projet
Ce projet s'inscrit dans le cadre du projet de synthèse de fin d'année. Il vise à répondre à une demande croissante de solutions de commerce électronique accessibles, évolutives et esthétiques, spécifiquement adaptées au marché marocain et à l'écosystème artisanal.

### 1.2 Problématique
Les artisans locaux souffrent d'une fracture numérique profonde. Les outils e-commerce classiques sont complexes, coûteux et inadaptés aux réalités des petites structures artisanales. Cette exclusion numérique freine le développement économique local et la mise en valeur de l'histoire des marques marocaines.

### 1.3 Objectifs du projet
- **Identité Unique :** Proposer une expérience visuelle 100% "Luxe Marocain" (Or, Cuivre, Zellige).
- **Zéro Effort (Propulsé par l'IA) :** Génération automatique de la boutique et des produits en moins de 2 minutes.
- **Isolation SaaS :** Chaque vendeur possède son propre domaine logique et ses paramètres sécurisés.

### 1.4 Périmètre du système
Le système s'adresse à des cibles bien définies :
- **L'Artisan Traditionnel :** Maître artisan (Zellige, poterie, cuir) souhaitant une vitrine haut de gamme sans complexité.
- **Le Concepteur de Mode :** Créateur cherchant à valoriser son identité.
- **Le Vendeur Numérique :** Créateur de contenus (livres numériques, modèles) cherchant l'automatisation.
- **Le Client "Luxe & Authenticité" :** Acheteur recherchant des produits certifiés avec une expérience d'achat fluide.

## 2. ANALYSE DES BESOINS

### 2.1 Besoins fonctionnels
Le système intègre 25 fonctionnalités clés réparties en catégories :
- **Fonctionnalités IA :** Générateur de boutique par l'IA (Logo, Couleurs, Bannière), Générateur de produits par l'IA, Recherche intelligente.
- **Place de marché Multi-boutiques :** Boutiques indépendantes, Tableau de bord vendeur, Personnalisation totale.
- **Commerce Social :** Fil d'actualité social (S'abonner, Aimer, Partager), Système de tendances.
- **Communication & Ventes :** Messagerie en temps réel, Processus de paiement intelligent, Commandes sur-mesure.
- **Logistique :** Gestion des produits numériques, Zones de livraison, Géolocalisation.
- **Fidélisation & Affaires :** Système de points, Affiliation, Forfaits (Gratuit, Pro, Premium), Classement des boutiques.
- **Administration & Gestion des accès :** Gestion d'équipe, Journaux d'activités, Notifications intelligentes, Gestion des promotions, Analyses statistiques avancées.

### 2.2 Besoins non fonctionnels & Budget
Le système est conçu pour être sécurisé, performant et évolutif. Le budget de réalisation estimatif sur 3 mois de développement s'élève à **94 550 MAD**, réparti comme suit :

| Catégorie | Description | Estimation (MAD) |
| :--- | :--- | :--- |
| **Hébergement & Serveurs** | Serveur Virtuel (VPS Cloud), Base de données, Cache Redis (budget annuel) | 12 000 |
| **API Intelligence Artificielle** | Jetons OpenAI (GPT-4), Accès API Génération d'images | 7 500 |
| **Développement & Conception** | Effort Humain (Design UI/UX, Front-end React, Back-end Laravel) | 70 000 |
| **Outils & Licences** | Noms de domaine, Certificats SSL, Outils de test et déploiement | 5 050 |
| **Budget Global Estimé** | | **94 550 MAD** |

## 3. ÉTUDE DE L’EXISTANT
Nous avons analysé les leaders du marché (Shopify) ainsi que les solutions locales (YouCan). Notre analyse révèle un besoin pour une plateforme qui allie facilité, identité marocaine haut de gamme et assistance par l'Intelligence Artificielle. Le modèle avec 0% de commission sur les forfaits payants de SOUK offre une alternative économiquement viable pour les artisans.

## 4. CONCEPTION DU SYSTÈME

### 4.1 Architecture générale
L'architecture adopte un modèle multi-locataires (Multi-tenant) garantissant une haute performance et une isolation sécurisée.

**Schéma de l'Architecture Technique :**
```text
[ Navigateur Web Client ] 
          ↓ (Requêtes HTTP/Axios sécurisées par JWT)
[ Front-end : React.js (Interface Utilisateur Rapide) ]
          ↓ (Appels API RESTful en JSON)
[ Back-end : API Laravel 11 (Logique Métier & Routage) ]
          ↓
  ├──→ [ Base de données : MySQL (Stockage persistant isolé par locataire) ]
  └──→ [ Cache & Sessions : Redis (Performances et chargement rapide) ]
```

### 4.2 Diagramme de cas d’utilisation
Ce diagramme présente les interactions entre les différents acteurs du système et les fonctionnalités accessibles selon les rôles définis. *(Figure 1 — Diagramme de Cas d'Utilisation Global SOUK ✦)*

**Explication du flux :**
Le système met en évidence trois acteurs principaux : 
- **Le Vendeur :** S'authentifie pour gérer sa boutique (produits, commandes, identité visuelle assistée par l'IA).
- **Le Client :** Navigue sur la place de marché, effectue des recherches, ajoute des produits au panier et valide ses paiements.
- **L'Administrateur :** Supervise la plateforme globale, gère les abonnements des vendeurs et analyse les statistiques de ventes.

### 4.3 Diagramme de classes
Architecture orientée objet de l'API Laravel 11. Les relations illustrent l'isolation multi-locataires assurée par le périmètre global appliqué sur chaque modèle. *(Figure 2 — Diagramme de Classes Technique)*

**Explication des entités :**
L'architecture montre les entités clés de l'application (Utilisateurs, Produits, Commandes, Abonnements). L'aspect le plus critique est la contrainte de "locataire" (identifiant de la boutique) appliquée systématiquement sur toutes les tables. Ce mécanisme de sécurité garantit qu'un Vendeur A ne pourra jamais interroger ou modifier accidentellement les produits ou les commandes d'un Vendeur B.

### 4.4 Modèle de données
La base de données repose sur une architecture à base unique optimisée, structurée par les tables suivantes :
- **Utilisateurs et Profils :** utilisateurs (authentification globale), clients, vendeurs, personnel.
- **Produits et Catalogue :** produits (liés strictement à une boutique).
- **Commandes et Panier :** commandes et articles de commande.
- **Finance et Abonnements :** forfaits SaaS, abonnements actifs, commissions.
- **Gestion des Accès :** équipes, rôles, permissions.

### 4.5 Diagramme de Séquence
Ce diagramme modélise le flux complet d'une requête authentifiée à travers la chaîne de filtres (middlewares), illustrant l'isolation garantie au niveau de la base de données. *(Figures 3 et 4)*

## 5. RÉALISATION DU PROJET

### 5.1 Technologies et outils utilisés
Afin d'assurer une expérience fluide et évolutive :
- **Back-end :** Laravel 11 (API sans interface graphique).
- **Front-end :** React.js (Vite), CSS Natif (Style Luxe Marocain).
- **Intelligence Artificielle :** OpenAI GPT-4 (Contenu), Midjourney (Design).
- **Hébergement :** Serveur Privé Virtuel (Cloud), MySQL, Redis.
- **Outils :** VS Code, GitHub, Figma, Postman.

### 5.2 Architecture technique (Laravel / React)
Le back-end Laravel sert d'API sécurisée. Le front-end consomme les points d'accès via Axios avec injection dynamique des jetons d'authentification. L'isolation des données est assurée au niveau du mappage objet-relationnel (ORM), garantissant aucune fuite de données entre les boutiques.

### 5.3 Implémentation des fonctionnalités principales
Durant les 3 mois de développement :
- **Mois 1 :** Architecture, base de données, Gestion des accès et interface utilisateur.
- **Mois 2 :** Implémentation des générateurs IA, du tableau de bord vendeur et des fonctionnalités sociales.
- **Mois 3 :** Place de marché globale, paiement intelligent, assurance qualité (QA) et déploiement.

### 5.4 Intégration Technique de l'Intelligence Artificielle
Afin de tenir la promesse d'une plateforme "Zéro Effort", nous avons intégré l'API OpenAI pour générer instantanément l'identité des boutiques et optimiser les fiches produits.

**Flux d'exécution de l'IA :**
1. **Saisie (Front-end) :** L'utilisateur remplit un formulaire très court (nom de la marque, domaine d'activité).
2. **Requête (API) :** Le Front-end React envoie une requête Axios à l'API Laravel.
3. **Traitement (OpenAI) :** Laravel construit un *Prompt* dynamique et effectue un appel sécurisé (cURL) vers l'API OpenAI (GPT-4).
4. **Sauvegarde (BDD) :** La réponse JSON retournée par l'IA est formatée, nettoyée et sauvegardée dans la base de données MySQL de la boutique.
5. **Affichage (Front-end) :** L'utilisateur voit sa boutique générée en temps réel.

**Exemple de Prompt Système envoyé à l'API :**
> *"Tu es un expert en commerce électronique de luxe. Génère une description optimisée pour le référencement (SEO) de 50 mots, ainsi qu'une palette de 3 couleurs (codes hexadécimaux) pour un artisan marocain nommé 'Atlas d'Or' vendant des bijoux traditionnels en argent."*

### 5.5 Flux de Paiement (Intégration Stripe / CMI)
Le processus de paiement (actuellement implémenté en simulation pour le prototypage) est structuré pour une intégration directe avec des passerelles bancaires modernes comme Stripe ou le CMI (Centre Monétique Interbancaire).

**Flux de transaction :**
1. **Panier :** Le client valide son panier sur l'interface React.
2. **Intention de paiement :** L'interface React demande un jeton de paiement (Token) à l'API Laravel.
3. **Passerelle :** Laravel contacte l'API Stripe/CMI pour générer une intention de paiement sécurisée (*Payment Intent*).
4. **Validation :** Le client saisit ses coordonnées bancaires de manière sécurisée (les données ne transitent pas par notre serveur).
5. **Webhook :** Une fois le paiement validé par la banque, la passerelle envoie un signal (*Webhook*) à l'API Laravel qui met automatiquement à jour le statut de la commande à "Payée" et notifie le vendeur.

## 6. FONCTIONNALITÉS DU SYSTÈME

### 6.1 Espace Administrateur
L'équipe interne SOUK gère la plateforme via des rôles (Super Administrateur, Support, Finance, Modérateur). Ils accèdent aux journaux d'activités, gèrent les abonnements et analysent les conversions globales.

### 6.2 Espace Vendeur
L'artisan accède à un tableau de bord où il utilise le générateur IA pour créer son identité visuelle et générer des descriptions optimisées pour les moteurs de recherche (SEO). Il peut interagir via la messagerie instantanée avec ses clients.

### 6.3 Espace Client
Les acheteurs naviguent dans une place de marché luxueuse, utilisent la recherche intelligente, profitent d'un fil d'actualité pour découvrir les artisans, et finalisent leurs achats via un processus de paiement incluant un système de points de fidélité.

### 6.4 Sécurité et Optimisation (SEO)
- **Flux de Sécurité JWT (JSON Web Token) :** L'authentification est totalement "stateless". Lors de la connexion, l'utilisateur reçoit un jeton cryptographique valide pour une courte durée. Chaque requête ultérieure vers l'API doit inclure ce jeton dans l'en-tête (Header) pour valider l'identité de l'utilisateur, ce qui empêche les failles classiques de type CSRF.
- **Optimisation SEO (Référencement Naturel) :** Les boutiques des artisans bénéficient de balises meta dynamiques générées par l'IA et de temps de chargement ultra-rapides grâce au chargement différé (Lazy Loading), ce qui améliore drastiquement leur positionnement sur les moteurs de recherche.

## 7. TESTS ET VALIDATION
Le système a été éprouvé via des tests logiciels stricts durant le 3ème mois du projet :

- **Tests d'API (Exemple de Cas de Test avec Postman) :**
  - **Objectif :** Vérifier l'authentification d'un utilisateur.
  - **Requête :** `POST /api/v1/auth/login`
  - **Corps envoyé (JSON) :** `{ "email": "artisan@souk.ma", "password": "password123" }`
  - **Résultat Attendu :** Code HTTP `200 OK`, retournant un objet contenant le `token` JWT de connexion.
  - **Résultat Obtenu :** Succès. L'API retourne le jeton en 120 millisecondes.

- **Tests d'isolation :** Validation des restrictions d'accès croisé aux bases de données pour s'assurer qu'un vendeur ne peut pas falsifier un identifiant dans l'URL pour voir les commandes d'un concurrent.
- **Tests de Charge & Performance :** Validation du système de cache Redis assurant que la page d'accueil de la place de marché charge en moins de 1.5 seconde.

## 8. DIFFICULTÉS RENCONTRÉES ET SOLUTIONS

**Difficultés techniques :**
- **Architecture de la Base de données :**
  - *Problème :* Isoler les données sans multiplier les coûts d'infrastructure.
  - *Solution :* Adoption d'une architecture à base unique avec intégration d'un identifiant de locataire géré automatiquement.
- **Performance de l'interface avec un design riche :**
  - *Problème :* Les éléments visuels risquaient de ralentir l'application.
  - *Solution :* Utilisation de CSS natif combiné au chargement différé.

**Limites assumées :**
- L'application mobile (iOS/Android) est hors périmètre, l'accent étant mis sur le Web adaptatif (Responsive).
- Le support multilingue avancé est hors périmètre initial (Arabe et Français implémentés de base).
- L'intégration de paiement est en mode simulation.

## 9. PERSPECTIVES D’ÉVOLUTION
L'infrastructure actuelle étant hautement évolutive, plusieurs améliorations sont programmées :
- **Intégration Réelle du Paiement :** Remplacement de la simulation par des passerelles bancaires (CMI/Stripe).
- **Applications Mobiles :** Développement d'applications natives iOS/Android pour maximiser l'engagement utilisateur.
- **Expansion Internationale :** Internationalisation complète du contenu et expédition transfrontalière pour promouvoir l'artisanat marocain à l'échelle mondiale.

## CONCLUSION
Le projet SOUK ✦ a atteint son objectif : offrir une infrastructure de transformation numérique accessible et luxueuse pour l'écosystème artisanal marocain. Grâce à la combinaison d'une architecture logicielle moderne (Laravel/React) et de l'Intelligence Artificielle, SOUK élimine les barrières techniques tout en respectant une enveloppe budgétaire stricte (94 550 MAD). Ce projet démontre qu'une approche SaaS rigoureusement exécutée peut avoir un impact socio-économique réel.

## ANNEXES
*(Section réservée pour l'intégration de vos documents visuels)*
- Captures d’écran de l’application
- Guide d’utilisation
- Installation et configuration
- Diagrammes UML
