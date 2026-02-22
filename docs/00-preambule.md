# Screeps IA — Document préambule

> **Repo :** https://github.com/Erosdy/screeps  
> **Date :** Février 2025  
> **Statut :** Initialisation du projet — environnement en place, développement non démarré

---

## Contexte du projet

Le projet consiste à développer une intelligence artificielle pour le jeu **Screeps**, en **TypeScript**. L'objectif est
de concevoir un système autonome capable de piloter des unités (les *creeps*) via un mécanisme de gestion de tâches
distribuées.

Le point de départ est un clone de *
*[screeps-typescript-starter](https://github.com/screepers/screeps-typescript-starter)**, avec un environnement Docker
monté et fonctionnel.

---

## Vision technique

L'architecture centrale repose sur un **système de tickets** : chaque action ou objectif à accomplir est modélisé sous
forme de ticket. Les creeps consultent les tickets disponibles, en sélectionnent un, et l'exécutent. Ce modèle permet
une distribution naturelle du travail entre unités sans coordination centralisée rigide.

Le code est **organisé par domaine métier** — chaque domaine regroupe ses propres entités, logiques et interfaces, de
manière cohésive et indépendante.

---

## Conventions de code

### Nommage des fichiers

Les fichiers suivent la convention kebab-case avec suffixe de rôle :

```
ma-classe.interface.ts
ma-classe.repository.ts
ma-classe.service.ts
```

### Nommage des classes

Les classes reprennent le nom du fichier en PascalCase avec suffixe :

```typescript
class MaClasseInterface {
...
}

class MaClasseRepository {
...
}
```

### Typage

- Les `any` sont **proscrits** autant que possible.
- Les cast manuels (`as MonType`) sont tolérés uniquement lorsqu'inévitables, et doivent rester explicites et localisés.

---

## Méthodologie de travail

Le développement suit trois principes ordonnés :

1. **Make it work** — faire fonctionner la feature, sans sur-ingénierie.
2. **Make it right** — refactorer, clarifier, structurer correctement.
3. **Make it fast** — optimiser si et seulement si nécessaire.

Le principe **YAGNI** (*You Aren't Gonna Need It*) s'applique : on n'implémente pas ce dont on n'a pas encore besoin. Ce
point demande une vigilance active.

### Cycle de développement

Chaque itération démarre par la **définition de la prochaine feature** à implémenter, avant tout développement. Chaque
feature donne lieu à une **Pull Request dédiée**, accompagnée d'un document de suivi qui historise les décisions et
évolutions du projet.

---

## Rôle de Claude

Claude intervient en tant que **reviewer** et **lead advisor** tout au long du projet. Son rôle est de :

- Challenger les choix d'architecture et de conception.
- Effectuer des revues de code (qualité, lisibilité, respect des conventions).
- Proposer des pistes de réflexion et des alternatives, éventuellement illustrées en **pseudo-code**.

Claude **ne produit pas de code réel** sauf demande explicite — les décisions d'implémentation restent à la charge du
développeur.

---

## Ce document

Ce fichier constitue le **document zéro** du projet. Il sera suivi de documents spécifiques créés à chaque Pull Request,
afin de constituer un historique vivant des évolutions du projet, des décisions prises, et des apprentissages accumulés.