# PR-4 — Refacto : Interfaces tickets & système de repositories

> **Fichier :** `03-refacto-interfaces-tickets.md`  
> **Date :** Février 2025  
> **Statut :** En cours  
> **PR :** https://github.com/Erosdy/screeps/pull/4

---

## Objectif

Solidifier les fondations du système de tickets : typer précisément chaque variant de ticket via une discriminated union,
unifier et enrichir le système de repositories, et corriger la génération d'id peu lisible héritée de la PR-3.

---

## Architecture & décisions techniques

### Discriminated union sur `TicketInterface`

`TicketInterface` devient une union taguée sur `type` :

```typescript
type TicketInterface = BuilderTicket | RepairerTicket | UpgraderTicket | ContainerFillerTicket;
```

Chaque variant étend `BaseTicketInterface<T extends TicketTypeEnum>`, qui force la présence d'un `type` littéral précis.
`targetId` est alors typé spécifiquement par variant (`Id<ConstructionSite>`, `Id<Structure>`, etc.) sans aucun cast
côté consommateur — le narrowing TypeScript s'en charge dès qu'on vérifie `ticket.type`.

La même logique a été appliquée à `NeedInterface` pour maintenir la cohérence structurelle avec les tickets.
Ce changement débordait légèrement du scope initial mais était une dépendance naturelle : sans union sur les needs,
`fromNeed` aurait nécessité des casts que la discriminated union sur les tickets rendait visibles et indésirables.

### `MemoryKey` — smart enum

`MemoryKeyEnum` est remplacée par une classe `MemoryKey` dont les valeurs statiques sont des instances :

```typescript
export class MemoryKey {
    public static readonly TICKETS = new MemoryKey("tickets", "TICKET");
    public static readonly NEEDS   = new MemoryKey("needs",   "NEED");

    private constructor(
        public readonly path: RepositoryMemoryPaths,
        public readonly prefix: string
    ) {}
}
```

Chaque clé porte son `path` (clef dans `Memory`) et son `prefix` (utilisé à la génération d'id). Le `private constructor`
garantit qu'aucune valeur ne peut être créée en dehors de la classe — comportement d'enum préservé.

`RepositoryMemoryPaths` est défini comme `keyof Pick<Memory, 'tickets' | 'needs'>` pour déclarer explicitement
les clés autorisées. Un `Omit<Memory, 'inputs'>` aurait exclu passivement une clé connue, laissant toute nouvelle
entrée non-`Record` dans `Memory` silencieusement incluse. Le `Pick` est plus intentionnel : une nouvelle clé
n'intègre `RepositoryMemoryPaths` que par décision explicite.

### `DraftEntite<T>` — création sans id

```typescript
export type DraftEntite<T extends EntiteInterface> = Omit<T, 'id'>;
```

Permet de passer un objet sans `id` à `save()`. Le repo génère l'id et retourne l'entité complète. Les surcharges dans
le décorateur modélisent ce contrat explicitement :

```typescript
save(entity: E): E;
save(entity: DraftEntite<E>): E;
save(entity: E | DraftEntite<E>): E { ... }
```

### Génération d'id lisible

L'id est désormais généré depuis `memoryKey.prefix` plutôt que `entity.constructor.name` :

```typescript
id: `${memoryKey.prefix}$${Game.time}$${this._index++}`
```

Les ids en mémoire sont maintenant lisibles (`TICKET$12345$0`) plutôt que le nom de la classe anonyme produite par
le décorateur.

### Déclaration `Memory` typée

`Memory` est enrichie avec les types métier :

```typescript
declare global {
    interface Memory {
        inputs:  InputInterface[];
        needs:   Record<string, NeedInterface>;
        tickets: Record<string, TicketInterface>;
    }
}
```

Combinée à `keyof Memory` dans `MemoryKey`, cette déclaration élimine les casts `as any` sur les accès à `Memory`
dans le décorateur, et offre la complétion et la sécurité de type partout dans le projet.

### Renommage `HarvesterTicket` → `ContainerFillerTicket`

Le ticket représente "aller remplir un container", pas "récolter à la source". Le renommage aligne le nom sur
l'intention réelle. `TicketTypeEnum.HARVEST` devient `TicketTypeEnum.FILL_CONTAINER`.

---

## Alternatives écartées

**Héritage Need → Ticket** — faire étendre `FillContainerTicket` de `FillContainerNeed` aurait couplé deux couches
aux responsabilités distinctes. Un need est un signal brut, un ticket est une tâche arbitrée avec priorité et assignation.
Les deux partagent `TicketTypeEnum` comme référence commune — c'est le bon niveau de couplage.

**`fromNeed` par type dans `TicketFactory`** — un switch avec une méthode dédiée par variant aurait garanti la cohérence
`type`/`targetId` à la compilation, sans aucun cast. Écarté car la génération automatique de needs par les entités
(prochaine PR) est le bon moment pour solidifier cette couche — inutile d'anticiper.

---

## Apprentissages & points de vigilance

**Scope creep assumé sur `NeedInterface`** — la discriminated union sur les needs débordait du scope tickets.
Le changement était une dépendance naturelle mais aurait pu attendre la PR dédiée aux needs. À surveiller pour les
prochaines itérations : ne pas laisser l'enthousiasme technique élargir le scope sans le questionner.

**`Omit` sur une union** — `DraftEntite<TicketInterface>` (soit `Omit<union, 'id'>`) ne se comporte pas toujours
comme `Omit` appliqué à chaque membre. Dans ce projet le type est utilisé en position d'entrée (`save`) et non
de sortie, ce qui limite les surprises — mais le point mérite vigilance si l'usage évolue.

**`fromNeed` sans garantie compilateur (TODO)** — la `TicketFactory` construit un ticket depuis un need sans switch
par type. La cohérence `type`/`targetId` repose sur la compatibilité structurelle des deux unions, pas sur une
vérification à la compilation. À corriger lors de l'introduction de la génération automatique de needs.

---

## Bilan & prochaines étapes

Le système de tickets repose désormais sur des fondations solides : unions discriminées, repositories enrichis, ids
lisibles, `Memory` typée. Le périmètre est propre et la dette technique résiduelle est identifiée et documentée.

La prochaine PR porte sur l'enrichissement des tickets avec des propriétés métier spécifiques par type (ex :
`amountEnergy` sur `ContainerFillerTicket`), ce qui permettra de piloter plus finement les comportements des creeps
depuis les tickets. Elle adressera également la résolution de la source d'énergie au moment de la création du ticket
plutôt qu'à chaque tick — ce qui éliminera la dette CPU du double `findClosestByPath` identifiée dès la PR-01 et
le `containers[0]` approximatif de la PR-03.

À terme, la génération automatique de needs par les entités de la map sera l'occasion de solidifier la couche need
et de corriger le `fromNeed` générique dans `TicketFactory`.