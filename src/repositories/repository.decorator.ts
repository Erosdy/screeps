import {EntiteInterface} from "./entite.interface";
import {MemoryKeyEnum} from "./memory-key.enum";

export function Repository<E extends EntiteInterface>(memoryKey: MemoryKeyEnum) {
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
					if (Memory[memoryKey] == null) {
						Memory[memoryKey] = {};
					}
					this._cache = new Map(Object.entries(Memory[memoryKey])) as unknown as Map<string, E>;
				}
				return this._cache;
			}

			save(entity: E): E {
				if (entity.id == null) {
					const entityName = entity.constructor.name;
					entity.id = `${entityName}$${Game.time}$${this._index++}`;
				}
				this.getCache().set(entity.id, entity);
				(Memory[memoryKey] as any)[entity.id] = entity;
				return entity;
			}

			delete(id: string): void {
				this.getCache().delete(id);
				delete (Memory[memoryKey] as any)[id];
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