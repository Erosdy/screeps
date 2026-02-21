import {NeedRepository} from "../need/need.repository";
import {TicketInterface} from "./ticket.interface";
import {NeedInterface} from "../need/need.interface";
import {TicketPriorityEnum} from "./ticket-priority.enum";
import {TicketRepository} from "./ticket.repository";

export class TicketFactory {
	private static _instance: TicketFactory;

	static getInstance(): TicketFactory {
		if (this._instance == null) {
			this._instance = new TicketFactory();
		}

		return this._instance;
	}

	public generateTicketsFromNeeds(): void {
		const needRepository = NeedRepository.getInstance();
		const needs = needRepository.getNeeds();
		if (needs.length == 0) {
			return;
		}
		const ticketRepository = TicketRepository.getInstance();
		for (const need of needs) {
			const ticket = this.generateFromNeed(need);
			ticketRepository.save(ticket);
			needRepository.delete(need);
		}
	}

	private generateFromNeed(need: NeedInterface): TicketInterface {
		return {
			...need,
			priority: TicketPriorityEnum.DEFAULT
		}
	}
}