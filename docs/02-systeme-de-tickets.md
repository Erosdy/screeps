# PR-3 — Système de tickets

> **Fichier :** `02-systeme-de-tickets.md`  
> **Date :** Février 2025  
> **Statut :** Mergée  
> **PR :** *(à renseigner)*

---

## Objectif

Mettre en place le premier système de tickets : les creeps ne pilotent plus leur propre comportement de façon autonome,
ils consultent un pool de tickets et en exécutent un. C'est la pierre angulaire de l'architecture décrite dans le
préambule.

---

## Architecture & décisions techniques

### Flux général

À chaque tick, le `main.ts` orchestre la séquence suivante :

1. `NeedFactory.generateNeedFromInputs()` — convertit les inputs utilisateur en besoins.
2. `TicketFactory.generateTicketsFromNeeds()` — convertit les besoins en tickets.
3. Tick du `metaCreepTree` sur chaque creep.

### Le pipeline Input → Need → Ticket

Trois couches distinctes modélisent le chemin d'une intention à une tâche assignable :

**Input** — saisie manuelle via `Memory.inputs`. Une `InputInterface` contient un `type` et un `targetId`. L'
`InputRepository` est volontairement hors du système `@Repository` : les inputs n'ont pas d'id (contraignant à générer à
la main) et sont gérés comme une simple liste consommable.

**Need** — signal brut issu soit d'un input utilisateur, soit d'un ticket en échec (le besoin est peut-être toujours
présent). Le besoin possède un id généré par le système. Cette couche est conçue pour accueillir à terme des besoins
produits automatiquement par les entités de la map (ex : une extension vide qui émet un besoin de remplissage).

**Ticket** — tâche validée et assignable à un creep. La `TicketFactory` est l'arbitre : c'est elle qui décidera à terme
si un besoin est légitime et ne fait pas doublon avec un ticket existant. Pour l'instant, tous les besoins sont
acceptés.

### Le méta-tree

Un `metaCreepTree` sert de point d'entrée universel pour tous les creeps :

```
Selector
├── Sequence
│   ├── HasAssignedTicketCondition
│   └── ExecuteTicketAction
└── FindTicketAction
```

`FindTicketAction` prend le ticket de plus haute priorité parmi les tickets non assignés et l'assigne au creep.
`ExecuteTicketAction` résout le tree correspondant au type du ticket via la `TreeFactory`, l'exécute, et gère les
transitions : `FINISH` → suppression du ticket, `FAILURE` → régénération du besoin et suppression du ticket.

### Les métiers disponibles

Quatre trees métier sont disponibles : `harvester`, `builder`, `upgrader`, `repairer`. Les trois derniers partagent un
pattern commun : ils retirent d'abord de l'énergie d'une structure via `withdraw` avant d'aller accomplir leur tâche.
Le harvester récolte directement à la source.

### Décorateurs @Singleton et @Repository

`@Singleton` expose un `getInstance()` statique et interdit l'instanciation directe. Un double cast
`as unknown as SingletonClass<T>` est nécessaire côté consommateur pour contourner la limite de l'inférence TypeScript
sur les classes transformées par décorateur — c'est explicite et localisé.

`@Repository(MemoryKeyEnum.XXX)` injecte sur la classe décorée toute la logique CRUD : cache en mémoire vive,
persistance dans `Memory`, génération d'id, `save`, `delete`, `findAll`, `findById`. Les classes décorées étendent
`RepositoryAbstract` pour disposer du typage côté interne (notamment `getCache()`), et implémentent
`RepositoryInterface` pour le typage externe.

---

## Alternatives écartées

La conversion directe Input → Ticket sans couche Need a été envisagée. Elle a été écartée au profit d'une séparation
plus franche des responsabilités : le Need est un signal brut non encore validé, le Ticket est une tâche arbitrée.
Cette distinction permettra à terme à n'importe quelle entité de la map d'émettre des besoins sans connaître la logique
de création des tickets.

---

## Apprentissages & points de vigilance

**`isLastNode` et `TaskStatusEnum.FINISH` (dette assumée)** — Pour signaler la fin d'un ticket, les actions terminales
implémentent `AbstractAction` et reçoivent un flag `isLastNode`. C'est un couplage entre une action métier et la notion
de fin de ticket, identifié et à corriger dans la prochaine PR via une `CloseTicketAction` dédiée.

**Bug corrigé en cours de PR** — Le spread de `NeedInterface` dans `TicketInterface` dans `fromNeed()` propageait l'id
du need dans le ticket. Corrigé : l'id est retiré du spread, la génération d'id est laissée au `@Repository`.

**Génération d'id peu lisible (TODO)** — L'id généré par `@Repository` utilise `entity.constructor.name`, qui
correspond au nom de la classe anonyme produite par le décorateur, pas au nom de l'entité métier. Les ids en mémoire
sont donc peu lisibles. À adresser dans une prochaine PR.

**`MoveToEnergyContainerAction` — sélection approximative** — `containers[0]` est retourné sans tri ni critère. Ce
sera résolu dans la prochaine PR : la cible sera résolue une fois à la création du ticket et portée par le `targetId`,
ce qui éliminera également le double `findClosestByPath` hérité de la PR-01.

---

## Bilan & prochaines étapes

Le système de tickets est opérationnel de bout en bout : les creeps consultent un pool, s'assignent un ticket, et
exécutent le tree correspondant. Le flux Input → Need → Ticket est en place et extensible.

La prochaine PR est un refacto ciblé sur les tickets, avec plusieurs chantiers identifiés : introduction d'une
`CloseTicketAction` pour supprimer le flag `isLastNode`, résolution de la cible au niveau de la création du ticket
(adresse la dette CPU du double `findClosestByPath` et le `containers[0]` approximatif), et ajout de conditions de
résolution sur les tickets. Le renommage du harvester en "container filler" et l'évolution de son comportement sont
également dans le scope.