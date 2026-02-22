import {NeedRepository} from "../need/need.repository";
import {TicketInterface} from "./ticket.interface";
import {NeedInterface} from "../need/need.interface";
import {TicketPriorityEnum} from "./ticket-priority.enum";
import {TicketRepository} from "./ticket.repository";
import {Singleton} from "../singleton/singleton.decorator";
import {SingletonClass} from "../singleton/singleton.type";

@Singleton
export class TicketFactoryImpl {

	public generateTicketsFromNeeds(): void {
		const needRepository = NeedRepository.getInstance();
		const needs = needRepository.findAll();
		if (needs.length == 0) {
			return;
		}
		const ticketRepository = TicketRepository.getInstance();
		for (const need of needs) {
			const ticket = this.fromNeed(need);
			ticketRepository.save(ticket);
			needRepository.delete(need.id);
		}
	}
  
	private fromNeed(need: NeedInterface): TicketInterface {
		return {
			type: need.type,
			targetId: need.targetId,
			priority: TicketPriorityEnum.DEFAULT,
			assignTo: undefined
		} as TicketInterface; // Cast obligatoire ici, on a pas d'ID, il sera ajouté au moment du save dans le repository
	}
}

export const TicketFactory = TicketFactoryImpl as unknown as SingletonClass<TicketFactoryImpl>;