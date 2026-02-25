import {NeedRepository} from "../need/need.repository";
import {TicketInterface} from "./ticket.interface";
import {NeedInterface} from "../need/need.interface";
import {TicketPriorityEnum} from "./ticket-priority.enum";
import {TicketRepository} from "./ticket.repository";
import {Singleton} from "../singleton/singleton.decorator";
import {SingletonClass} from "../singleton/singleton.type";
import {DraftEntite} from "../repositories/draft-entite.type";

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

	// TODO: Implémenter un fromNeed par type de need pour garantir la cohérence
	// type/targetId à la compilation
	// À traiter lors de l'introduction de la
	// génération automatique de needs par les entités.
	private fromNeed(need: NeedInterface): DraftEntite<TicketInterface> {
		return {
			type: need.type,
			targetId: need.targetId,
			priority: TicketPriorityEnum.DEFAULT,
			assignTo: undefined
		};
	}
}

export const TicketFactory = TicketFactoryImpl as unknown as SingletonClass<TicketFactoryImpl>;