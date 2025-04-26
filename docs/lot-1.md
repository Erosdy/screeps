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
      code. Il acceptera l'objet source (`LoggableInterface`) comme argument.
    * **Format standardisé :** Messages incluant `[Tick] [Level] [SourceId]` et formatage cohérent pour les
      paramètres/retours/erreurs.
    * **Interface `LoggableInterface` :** Interface TypeScript définissant la structure minimale (au moins une propriété
      `id: string`) pour un objet pouvant servir de source de contexte pour les logs.
4. **Memory Repositories :** Des modules dédiés (au moins un `CreepMemoryRepository` et un `SpawnMemoryRepository`) pour
   gérer de manière centralisée et abstraite la lecture/écriture des données persistantes dans l'objet global `Memory`.
   Cela améliore la propreté et la testabilité du code en isolant la logique d'accès mémoire.
5. **Modules Utilitaires :** Des fonctions ou modules statiques pour des tâches transversales (ex:
   `Finder.findSource(room)` pour trouver des sources, `Finder.findSpawn(room)` pour trouver un spawn, etc.).

## Décisions Architecturales Clés - Système de Logging

Lors du développement de l'infrastructure de logging pour le Lot 1, une décision a été prise pour définir une
répartition claire des responsabilités concernant le formatage et le filtrage des messages, s'écartant légèrement de la
spécification initiale qui impliquait une centralisation plus poussée du formatage dans le `LogService`.

Cette approche est guidée par le principe d'une meilleure séparation des préoccupations et vise à définir un rôle précis
et limité pour chaque composant clé du système de logging.

**Rôle du `LogService` (Après Décision)**

Le module `LogService` (ex: `src/log/log.service.ts`) a un rôle bien défini, combinant des responsabilités de base pour
l'affichage des logs dans l'environnement Screeps :

1. **Filtration par Niveau (`_canWrite`)** : Déterminer si un message doit être affiché en comparant son niveau (
   `ELogLevel`) avec le niveau de log global configuré (lu via `configurationRepository.getLogLevel()`). Un message
   n'est traité que si son niveau est inférieur ou égal au niveau global configuré.
2. **Formatage Standard (`_formatLog`)** : Appliquer un formatage standard *minimal* à toutes les entrées de log reçues.
   Ce formatage inclut l'ajout automatique du **niveau de log**, du **tick actuel (`Game.time`)**, de l'**ID de la
   source (`ILoggable`)**, et la **substitution des arguments (`{}`)** présents dans le message fourni via
   `_buildDynamicMessage`.
3. **Colorisation (`_getColorFromLogLevel`)** : Associer une couleur (`EColor`) au message formaté en fonction de son
   niveau de log.
4. **Écriture en Console (`_writeLog`)** : Afficher la chaîne de caractères finale (préfixée et colorisée) dans la
   console du jeu.

Le `LogService` **n'est pas responsable** de :

* Choisir dynamiquement le format *global* du message (`SINGLE_LINE` vs `ENTRY_EXIT`, etc.) en fonction d'une
  configuration lue par *lui-même*. Il applique un format standard unique (`[Niveau] Tick SourceId MessageArgs`) aux
  messages qu'il reçoit via `_formatLog`.

Les méthodes publiques du `LogService` (`debug`, `info`, `warn`, `error`) s'attendent à recevoir :

* Un contexte optionnel (`ILoggable | undefined`) pour identifier la source du log et permettre l'ajout de son ID dans
  le préfixe standard.
* Une **chaîne de caractères `message`** qui représente le corps *principal* du message de log.
* Des **arguments supplémentaires (`...args`)** qui seront utilisés par le `LogService` lui-même pour la substitution (
  `"{}"`) dans le corps du message fourni.

**Rôle du Décorateur `@Logging` et des Autres Appelants**

Dans cette architecture, les composants qui *appellent* le `LogService` prennent en charge la responsabilité de
construire le **corps principal** du message (`message` argument) et de gérer le format global souhaité (`SINGLE_LINE`/
`ENTRY_EXIT`), ainsi que le niveau de sévérité de leur propre log :

1. **Définition du Niveau de Log** : L'appelant (notamment le décorateur `@Logging`) définit le niveau de log du message
   qu'il va générer. Pour le décorateur `@Logging` dans le Lot 1, ce niveau est défini **via un paramètre passé lors de
   son application** (ex: `@Logging(ELogLevel.DEBUG)`). Ce paramètre indique la sévérité *intrinsèque* des informations
   loguées par cette méthode décorée.
2. **Lecture de la Configuration du Format Global** : Des composants comme le décorateur `@Logging` liront la
   configuration `Memory.logFormat` via `configurationRepository.getLogFormat()` pour connaître le format d'affichage
   global souhaité (`SINGLE_LINE` ou `ENTRY_EXIT`).
3. **Collecte des Informations de Contexte Spécifiques** : Ils collecteront toutes les données spécifiques nécessaires
   au formatage selon le `ELogFormat` choisi (nom de la méthode décorée, valeur de retour, erreur levée, arguments
   spécifiques à afficher pour le format `ENTRY_EXIT`, etc.).
4. **Construction du Corps du Message (`message` argument)** : Sur la base du format global configuré (`SINGLE_LINE` ou
   `ENTRY_EXIT`) et des informations collectées, ils construiront la **chaîne de caractères qui formera le corps
   principal** passé à la méthode publique du `LogService`. Par exemple, pour `ENTRY_EXIT`, le décorateur pourrait
   construire une chaîne comme `"Entering method {}: {}"` (où les `{}` seraient substitués par le service avec le nom de
   la méthode et ses arguments).
5. **Appel au `LogService`** : Ils appelleront la méthode publique appropriée du `LogService` (`log.debug`, `log.info`,
   etc.), en lui passant le contexte `ILoggable`, la **chaîne de caractères du corps du message construite par
   l'appelant**, et les arguments supplémentaires nécessaires pour la substitution (`"{}"`) par le service dans ce
   corps.

**Gestion du Niveau de Log pour les Méthodes Décorées (Détails du Lot 1)**

Pour le Lot 1, la gestion de la verbosité des logs spécifiques aux méthodes décorées est gérée de la manière suivante :

* Le décorateur `@Logging` accepte un paramètre obligatoire `level: ELogLevel`. Ce paramètre définit le niveau de log *
  *auquel les messages générés par cette décoration seront envoyés** au `LogService`.
* Le décorateur générera son message et appellera la méthode publique correspondante du `LogService` (ex: `log.debug` si
  `level` est `ELogLevel.DEBUG`).
* Le filtrage final et effectif de ce log sera ensuite réalisé par le `LogService` en comparant ce niveau (`level`) avec
  le niveau de log *global* configuré dans `Memory.logLevel` (`configurationRepository.getLogLevel()`).

Cette approche privilégie la simplicité initiale en définissant le niveau de log de la décoration de manière statique
dans le code. Une gestion plus dynamique du niveau de log des décorateurs via une configuration en mémoire est
identifiée comme une amélioration possible pour les lots futurs.

**Justification de ce Choix**

Cette architecture présente les avantages suivants :

* **Clarté des Responsabilités** : Le `LogService` gère le filtrage final et l'ajout des informations système standard (
  niveau, tick, ID, substitution d'arguments générique). L'appelant (décorateur) gère la logique de *haut niveau* liée
  au format global (`ENTRY_EXIT` vs `SINGLE_LINE`) pour construire le corps principal du message, et définit le niveau
  de sévérité de ce message.
* **Réutilisation du Code** : La logique de substitution des arguments (`_buildDynamicMessage`) est centralisée dans le
  service.
* **Simplicité du Service** : Le code du `LogService` est plus simple à maintenir et à tester pour ses fonctions de
  base.
* **Simplicité Initiale du Décorateur** : Pour le Lot 1, la gestion statique du niveau de log du décorateur simplifie sa
  première implémentation.

L'inconvénient est que la logique de formatage du corps du message (en fonction de `ELogFormat`) est déportée dans le
décorateur, et la gestion de la verbosité des décorateurs n'est pas dynamiquement configurable en Lot 1 (nécessite un
redéploiement pour changer le paramètre `@Logging(level)`).

---