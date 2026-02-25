import {RepositoryInterface} from "./repository.interface";
import {EntiteInterface} from "./entite.interface";
import {DraftEntite} from "./draft-entite.type";

export abstract class RepositoryAbstract<E extends EntiteInterface> implements RepositoryInterface<E> {
	public delete(id: string): void {
		throw new Error("Should be implemented by Repository decorator");
	}

	findAll(): E[] {
		throw new Error("Should be implemented by Repository decorator");
	}

	findById(id: string): E | null {
		throw new Error("Should be implemented by Repository decorator");
	}

	save(entity: E | DraftEntite<E>): E {
		throw new Error("Should be implemented by Repository decorator");
	}

	protected getCache(): Map<string, E> {
		throw new Error("Should be implemented by Repository decorator");
	}

}