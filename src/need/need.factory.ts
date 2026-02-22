import {NeedRepository} from "./need.repository";
import {TicketInterface} from "../ticket/ticket.interface";
import {Singleton} from "../singleton/singleton.decorator";
import {SingletonClass} from "../singleton/singleton.type";
import {NeedInterface} from "./need.interface";
import {InputRepository} from "../input/input.repository";

@Singleton
export class NeedFactoryImpl {

	public generateNeed(ticket: TicketInterface): void {
		const needRepository = NeedRepository.getInstance();
		const need = {
			type: ticket.type,
			targetId: ticket.targetId,
		} as NeedInterface;
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
			} as NeedInterface;
			needRepository.save(need);
		}
		inputRepository.deleteAll();
	}

}

export const NeedFactory = NeedFactoryImpl as unknown as SingletonClass<NeedFactoryImpl>;