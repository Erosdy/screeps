import {EntiteInterface} from "./entite.interface";
import {DraftEntite} from "./draft-entite.type";

export interface RepositoryInterface<E extends EntiteInterface> {
	save(entity: DraftEntite<E> | E): E;

	delete(id: string): void;

	findById(id: string): E | null;

	findAll(): E[];
}