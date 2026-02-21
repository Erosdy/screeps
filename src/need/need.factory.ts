import {InputRepository} from "../input/input.repository";
import {NeedRepository} from "./need.repository";
import {InputInterface} from "../input/input.interface";
import {TicketInterface} from "../ticket/ticket.interface";

export class NeedFactory {

	private static _instance: NeedFactory;
	private static index: number = 0;

	static getInstance(): NeedFactory {
		if (this._instance == null) {
			this._instance = new NeedFactory();
		}
		return this._instance;
	}

	public generateNeed(ticket: TicketInterface): void {
		const need = {
			id: this.generateId({type: ticket.type, targetId: ticket.targetId}),
			type: ticket.type,
			targetId: ticket.targetId,
		}
		const needRepository = NeedRepository.getInstance();
		needRepository.save(need);
	}

	public generateNeedFromInputs() {
		const inputRepository = InputRepository.getInstance();
		const inputs = inputRepository.getInputs();
		if (inputs.length == 0) {
			return;
		}
		const needRepository = NeedRepository.getInstance();
		for (const input of inputs) {
			const need = {
				...input,
				id: this.generateId(input)
			};
			needRepository.save(need);
		}
		inputRepository.deleteAll();
	}

	// TODO cette méthode devrait être effectué via le save du repository
	private generateId(need: InputInterface) {
		return `${need.type}$${Game.time}$${++NeedFactory.index}`;
	}


}