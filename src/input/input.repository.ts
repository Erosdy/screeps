import {InputInterface} from "./input.interface";
import {Singleton} from "../singleton/singleton.decorator";
import {SingletonClass} from "../singleton/singleton.type";

// Même si c'est un repository, celui-ci, qui ne gère que les inputs utilisateur
// n'est pas géré de la même manière. On se contente donc d'implémenter les quelques méthodes
// nécéssaires.
@Singleton
export class InputRepositoryImpl {
	private _cache?: InputInterface[];

	public getInputs(): InputInterface[] {
		return this.getCache();
	}

	public deleteAll(): void {
		this._cache = [];
		Memory.inputs = [];
	}

	private getCache(): InputInterface[] {
		if (this._cache == null) {
			if (Memory.inputs == null) {
				Memory.inputs = [];
			}
			this._cache = Memory.inputs ?? [];
		}
		return this._cache;
	}
}

export const InputRepository = InputRepositoryImpl as unknown as SingletonClass<InputRepositoryImpl>;