# TODO — Chantiers & dette technique

> Ce document est mis à jour à chaque PR et sert de mémoire vivante des tâches identifiées mais non encore traitées.
> Dernière mise à jour : Février 2025 (post PR-4)

---

## Dette technique

- **`fromNeed` sans garantie compilateur** — la `TicketFactory` construit un ticket depuis un need sans switch par type. La cohérence `type`/`targetId` repose sur la compatibilité structurelle des deux unions, pas sur une vérification à la compilation. À corriger lors de l'introduction de la génération automatique de needs.

- **`RepositoryInterface.save`** — n'expose pas la surcharge `DraftEntite<E>`, incohérence mineure avec `RepositoryAbstract`. À aligner.

---

## Prochaine PR — Enrichissement des tickets

- Ajouter des propriétés métier spécifiques par type de ticket (ex : `amountEnergy` sur `ContainerFillerTicket`).
- Résoudre la source d'énergie à la création du ticket plutôt qu'à chaque tick — élimine le double `findClosestByPath` identifié en PR-01 et le `containers[0]` approximatif de PR-03.

---

## Chantiers futurs

- **Génération automatique de needs** — les entités de la map (extensions vides, structures endommagées, etc.) émettent leurs propres needs sans intervention manuelle. C'est le bon moment pour solidifier la couche need et introduire un `fromNeed` par type dans la `TicketFactory`.

- **Spawning basé sur les tickets** — spawner un creep quand le nombre de tickets en attente dépasse la capacité de traitement disponible. Le spawn devient un émetteur de needs à part entière.

- **Système de migration de Memory** — versionner la Memory pour gérer les changements de structure incompatibles entre deux pushs sans perdre la progression en cours.

- **Path caching** — sauvegarder le path calculé dans la Memory du creep pour éviter de recalculer le pathfinding à chaque tick. À adresser quand le CPU devient un facteur limitant mesuré en jeu.

- **Dashboard colonie** *(après génération automatique des needs v1)* — mettre en place un système de logs/visualisation permettant de comprendre d'un coup d'œil l'état global de la colonie : tickets par statut et par type, action en cours par creep, énergie disponible. Medium à définir au moment de l'implémentation (console, `RoomVisual`, ou les deux). L'objectif est de détecter rapidement un creep bloqué ou un type de ticket qui s'accumule sans être consommé.

- **`AbstractMoveTo` — portée configurable** — le range d'arrêt est actuellement fixe. Le rendre configurable par action pour couvrir les cas où la portée est supérieure à 1 (ex : `build`, `repair` à portée 3). Chaque action `MoveTo` descendante devrait pouvoir déclarer son `range` cible.