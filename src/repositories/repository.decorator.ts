import {EntiteInterface} from "./entite.interface";
import {DraftEntite} from "./draft-entite.type";
import {MemoryKey} from "./memory-key.class";

export function Repository<E extends EntiteInterface>(memoryKey: MemoryKey) {
	return function (target: any): any {
		let instance: any = null;

		const RepositoryClass = class extends target {
			private _cache: Map<string, E> | null = null;
			private _index = 0;

			constructor(...args: any[]) {
				super(...args);
			}

			static getInstance() {
				if (!instance) {
					instance = new RepositoryClass();
				}
				return instance;
			}

			getCache(): Map<string, E> {
				if (this._cache == null) {
					if (Memory[memoryKey.path] == null) {
						Memory[memoryKey.path] = {};
					}
					this._cache = new Map(Object.entries(Memory[memoryKey.path])) as unknown as Map<string, E>;
				}
				return this._cache;
			}

			save(entity: E): E;
			save(entity: DraftEntite<E>): E;
			save(entity: E | DraftEntite<E>): E {
				if (!('id' in entity)) {
					return this.save({
						...entity,
						id: `${memoryKey.prefix}$${Game.time}$${this._index++}`
					} as E);
				}
				this.getCache().set(entity.id, entity);
				(Memory[memoryKey.path] as any)[entity.id] = entity;
				return entity;
			}

			delete(id: string): void {
				this.getCache().delete(id);
				delete Memory[memoryKey.path][id];
			}

			findAll(): E[] {
				return [...this.getCache().values()];
			}

			findById(id: string): E | null {
				return this.getCache().get(id) ?? null;
			}
		}

		return RepositoryClass;
	};
}