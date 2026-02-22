# PR-2 — Behaviour Tree : Basique Harvester

> **Fichier :** `01-behaviour-tree-basique-harvester.md`  
> **Date :** Février 2025  
> **Statut :** Mergée  
> **PR :** https://github.com/Erosdy/screeps/pull/2

---

## Objectif

Mettre en place le premier behaviour tree opérationnel : un harvester basique capable de récolter de l'énergie à la
source la plus proche, puis de la déposer dans le spawn une fois son inventaire suffisamment rempli.

---

## Architecture & décisions techniques

### Structure du behaviour tree

Le système repose sur trois briques fondamentales :

- `BehaviourNode` — interface commune à tous les nœuds, actions et conditions. Expose une unique méthode `tick(creep)`.
- `Selector` — parcourt ses enfants jusqu'à en trouver un qui ne retourne pas `FAILURE`. Modélise un "essayer dans
  l'ordre".
- `Sequence` — parcourt ses enfants jusqu'à en trouver un qui ne retourne pas `SUCCESS`. Modélise un "faire dans
  l'ordre, tout ou rien".

Les statuts possibles sont portés par `TaskStatusEnum` : `SUCCESS`, `RUNNING`, `FAILURE`.

### Actions et conditions

Chaque feuille du tree implémente `BehaviourNode` :

- `HasEnoughEnergyCondition` — vérifie que le creep dispose d'au moins un seuil d'énergie (configurable, défaut 50).
- `HarvestEnergyAction` — récolte l'énergie de la source la plus proche si le creep est à portée.
- `TransferEnergyToSpawnAction` — dépose l'énergie dans le spawn le plus proche si le creep est à portée.

### Déplacement : pattern Template Method

Les actions de déplacement partagent la même logique via `AbstractMoveTo` : vérification de la cible, contrôle de la
portée, appel à `moveTo`. Seule la méthode `findTarget` est abstraite, redéfinie dans `MoveToClosestSourceAction` et
`MoveToClosestSpawnAction`. Ce pattern évite toute duplication tout en restant facilement extensible.

### Le tree basique harvester

```
Selector
├── Sequence          (déposer l'énergie)
│   ├── HasEnoughEnergyCondition
│   ├── MoveToClosestSpawnAction
│   └── TransferEnergyToSpawnAction
└── Sequence          (récolter l'énergie)
    ├── MoveToClosestSourceAction
    └── HarvestEnergyAction
```

Le Selector tente en priorité de déposer l'énergie si le creep en a assez ; sinon il va en récolter.

---

## Alternatives écartées

Une **state machine** a été sérieusement envisagée. Elle aurait rendu les transitions d'état explicites, mais au prix
d'une rigidité plus grande et d'une lisibilité réduite pour des comportements complexes.

Le behaviour tree a été retenu car il offre une alternative élégante : des conditions lisant la mémoire du creep
permettent de simuler la notion d'état sans en subir les contraintes. On obtient ainsi un modèle hybride BT/SM, flexible
et composable.

---

## Apprentissages & points de vigilance

**Double résolution de cible (dette technique assumée)** — `HarvestEnergyAction` et `TransferEnergyToSpawnAction`
appellent chacune `findClosestByPath` de leur côté, alors que l'action de déplacement précédente a déjà effectué cette
résolution. Dans Screeps, les appels CPU ont un coût non négligeable. Ce point est identifié et sera adressé dans une
prochaine PR.

**`ERR_TIRED` traité comme `SUCCESS` dans `HarvestEnergyAction`** — Le creep n'a pas encore harvesté mais le statut
retourné est `SUCCESS`. C'est un raccourci pragmatique pour l'instant, qui sera corrigé en PR-4.

---

## Bilan & prochaines étapes

Le socle du behaviour tree est en place : les nœuds composites (`Selector`, `Sequence`), l'interface `BehaviourNode`,
et un premier tree fonctionnel qui fait jouer un creep de bout en bout.

La prochaine étape est la première implémentation du système de tickets, pierre angulaire de l'architecture décrite
dans le préambule. La dette CPU sur le double `findClosestByPath` et la correction de `ERR_TIRED` sont identifiées mais
ne sont pas prioritaires à ce stade.
