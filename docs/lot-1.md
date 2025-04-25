# IA Screeps - Projet : Lot 1

## Objectif Général

Le Lot 1 de cette IA Screeps vise à créer une **première version autonome et fonctionnelle** capable de gérer les
opérations de base d'un avant-poste dans **une seule salle (room)**. L'objectif est d'avoir un code déployable sur le
serveur de jeu qui permette à l'avant-poste de survivre et de commencer son développement initial.

Le développement suivra une approche **itérative (agile)**, en commençant par le strict minimum vital et en
refactorant/améliorant continuellement le code. La méthodologie **Test-Driven Development (TDD)** sera appliquée pour
garantir la robustesse du code, notamment la logique des creeps et les transitions de la Machine à États.

## Stratégie Initiale

La stratégie principale pour ce Lot 1 est de se concentrer sur l'établissement d'une **collecte et d'une distribution d'
énergie fiables**. L'énergie est la ressource fondamentale nécessaire à toutes les autres actions (spawning, upgrading,
building).

## Composant Clé : Le Creep "Worker"

* **Rôle :** Le rôle initial et unique de ce Lot 1 est le **"Worker"**.
* **Philosophie (Lot 1) :** Pour simplifier le démarrage, le Worker est conçu comme une **unité généraliste et
  polyvalente**, capable d'effectuer les tâches de base liées à l'énergie (analogie avec les fourmis). L'idée d'une
  spécialisation des creeps sera abordée dans les lots futurs.

## Tâches Minimales du Worker (Logique Opérationnelle)

Le "Worker" doit être capable d'exécuter le cycle de vie de l'énergie :

1. **Trouver une source d'énergie** disponible dans la salle.
2. **Se déplacer** jusqu'à la source choisie.
3. **Miner l'énergie** de la source (en utilisant `creep.harvest()`).
4. **Stocker l'énergie** minée dans son inventaire (`creep.store`). Le minage continue jusqu'à ce que l'inventaire soit
   plein.
5. Une fois l'inventaire plein, **trouver une destination prioritaire** pour déposer l'énergie.
    * **Priorité 1 : Le Spawn** (la `StructureSpawn`) s'il a besoin d'énergie (pas plein). C'est essentiel pour assurer
      la production de nouveaux creeps.
    * **Priorité 2 : Le Controller** (la `StructureController`) s'il a besoin d'énergie (pour l'upgrade et éviter la
      dégradation). L'action sera `creep.upgradeController()`.
6. **Se déplacer** jusqu'à la destination choisie.
7. **Déposer l'énergie** à cette destination (en utilisant `creep.transfer()` pour le Spawn/structures ou
   `creep.upgradeController()` pour le Controller). L'action continue jusqu'à ce que l'inventaire soit vide ou la cible
   pleine.
8. Une fois l'inventaire vide, retourner à l'étape 1 pour collecter à nouveau de l'énergie.

## Architecture de l'IA du Creep

La logique de décision du "Worker" sera structurée comme une **Machine à États Finis (FSM)** gérée individuellement par
chaque creep. La logique reste distribuée entre les creeps pour ce Lot 1 (le pattern de gestionnaire de tâches
centralisé sera considéré pour un Lot ultérieur).

Les états initiaux de la FSM du Worker pour ce Lot 1 sont basés sur les phases principales du cycle de vie de l'énergie.
Pour faciliter le débogage et la clarté, nous utiliserons 4 états légèrement plus granulaires :

1. **`STATE_MOVING_TO_SOURCE` :** Le creep se déplace vers une source d'énergie identifiée.
2. **`STATE_MINING` :** Le creep est à portée d'une source et mine l'énergie.
3. **`STATE_MOVING_TO_TARGET` :** Le creep, l'inventaire plein, se déplace vers sa cible de dépôt (Spawn ou Controller).
4. **`STATE_PERFORMING_DELIVERY_ACTION` :** Le creep est à portée de sa cible de dépôt et exécute l'action de
   transfert (`transfer`) ou d'amélioration (`upgradeController`).

Les **transitions** entre ces états sont principalement basées sur l'état de l'inventaire du creep (vide/plein) et sa
position relative à ses cibles (à portée / non à portée). Le TDD sera utilisé pour valider ces transitions.

## Infrastructure et Outils Essentiels (Préréquis du Lot 1)

Pour supporter le développement et le bon fonctionnement de l'IA, plusieurs éléments d'infrastructure seront mis en
place :

1. **La Boucle de Jeu Principale (`main.ts`) :** Le point d'entrée du script exécuté à chaque tick. Elle sera
   responsable de :
    * Nettoyer la mémoire des creeps décédés (`Memory.creeps`).
    * Itérer sur tous les creeps vivants (`Game.creeps`) et exécuter leur logique de rôle (appeler
      `WorkerRole.run(creep)` pour les Workers).
    * Appeler la logique de gestion du Spawn.
    * Gérer l'initialisation globale de la mémoire (`Memory`) si nécessaire.
2. **Logique de Gestion du Spawn :** Un module ou une fonction qui s'exécute chaque tick pour chaque spawn. Elle
   vérifiera si le spawn est disponible et s'il est nécessaire de produire un nouveau Worker (ex: si le nombre de
   Workers vivants est inférieur à un seuil minimal).
3. **Système de Logging Robuste :** Un outil essentiel pour le débogage dans l'environnement Screeps. Ses spécifications
   sont :
    * **Niveaux :** DEBUG, INFO, WARN, ERROR.
    * **Contrôle de la verbosité :** Via une valeur configurable dans `Memory.logLevel`.
    * **Formats dynamiques :** Un paramètre dans `Memory.logFormat` (`FORMAT_SINGLE_LINE` ou `FORMAT_ENTRY_EXIT`)
      permettra de choisir le format des messages en temps réel.
    * **Décorateur `@Logging` :** Pour loguer automatiquement les entrées/sorties des méthodes décorées (sans stack
      trace incluse).
    * **LogService :** Un module séparé (`log.debug()`, `log.info()`, etc.) pour les logs manuels et contextuels dans le
      code. Il acceptera l'objet source (`Loggable`) comme argument.
    * **Format standardisé :** Messages incluant `[Tick] [Level] [SourceId]` et formatage cohérent pour les
      paramètres/retours/erreurs.
    * **Interface `Loggable` :** Interface TypeScript définissant la structure minimale (au moins une propriété
      `id: string`) pour un objet pouvant servir de source de contexte pour les logs.
4. **Memory Repositories :** Des modules dédiés (au moins un `CreepMemoryRepository` et un `SpawnMemoryRepository`) pour
   gérer de manière centralisée et abstraite la lecture/écriture des données persistantes dans l'objet global `Memory`.
   Cela améliore la propreté et la testabilité du code en isolant la logique d'accès mémoire.
5. **Modules Utilitaires :** Des fonctions ou modules statiques pour des tâches transversales (ex:
   `Finder.findSource(room)` pour trouver des sources, `Finder.findSpawn(room)` pour trouver un spawn, etc.).