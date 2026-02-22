import {EntiteInterface} from "./entite.interface";

export interface RepositoryInterface<E extends EntiteInterface> {
	save(entity: E): E;

	delete(id: string): void;

	findById(id: string): E | null;

	findAll(): E[];
}