export class MemoryKey {
	public static readonly TICKETS = new MemoryKey("tickets", "TICKET");
	public static readonly NEEDS = new MemoryKey("needs", "NEED");

	/**
	 *
	 * @param path La clef dans la Memory pour accéder aux entités.
	 * @param prefix Le prefix qui sera appliqué à toutes les entités lors de la génération d'id du save.
	 * @private
	 */
	private constructor(public readonly path: RepositoryMemoryPaths, public readonly prefix: string) {
	}
}

type RepositoryMemoryPaths = keyof Pick<Memory, 'tickets' | 'needs'>;