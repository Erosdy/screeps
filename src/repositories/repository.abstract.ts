import {RepositoryInterface} from "./repository.interface";
import {EntiteInterface} from "./entite.interface";

export abstract class RepositoriyAbstract<E extends EntiteInterface> implements RepositoryInterface<E> {
	public delete(id: string): void {
		throw new Error("Should be implemented by Repository decorator");
	}

	findAll(): E[] {
		throw new Error("Should be implemented by Repository decorator");
	}

	findById(id: string): E | null {
		throw new Error("Should be implemented by Repository decorator");
	}

	save(entity: E): E {
		throw new Error("Should be implemented by Repository decorator");
	}

	protected getCache(): Map<string, E> {
		throw new Error("Should be implemented by Repository decorator");
	}

}