import {InputInterface} from "./input.interface";

export class InputRepository {
	private static _instance: InputRepository;
	private _cache?: InputInterface[];

	static getInstance(): InputRepository {
		if (this._instance == null) {
			this._instance = new InputRepository();
		}
		return this._instance;
	}

	public getInputs(): InputInterface[] {
		return this.getCache();
	}

	public deleteAll(): void {
		this._cache = [];
		Memory.inputs = [];
	}

	private getCache(): InputInterface[] {
		if (this._cache == null) {
			this._cache = Memory.inputs ?? [];
		}
		return this._cache;
	}
}