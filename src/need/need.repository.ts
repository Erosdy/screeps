import {NeedInterface} from "./need.interface";

export class NeedRepository {
	private static _instance: NeedRepository;
	private _cache?: Map<string, NeedInterface>;

	static getInstance(): NeedRepository {
		if (this._instance == null) {
			this._instance = new NeedRepository();
		}
		return this._instance;
	}

	public getNeeds(): NeedInterface[] {
		return [...this.getCache().values()]
	}

	public save(need: NeedInterface) {
		this.getCache().set(need.id, need);
		Memory.needs[need.id] = need;
	}

	public delete(need: NeedInterface) {
		this.getCache().delete(need.id);
		delete Memory.needs[need.id];
	}

	private getCache(): Map<string, NeedInterface> {
		if (this._cache == null) {
			this._cache = new Map(Object.entries(Memory.needs ?? {}));
		}
		return this._cache;
	}
}