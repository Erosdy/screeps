import {TicketInterface} from "./ticket.interface";
import {Repository} from "../repositories/repository.decorator";
import {MemoryKeyEnum} from "../repositories/memory-key.enum";
import {RepositoryClass} from "../repositories/repository.type";
import {RepositoryAbstract} from "../repositories/repository.abstract";

@Repository(MemoryKeyEnum.TICKETS)
class TicketRepositoryImpl extends RepositoryAbstract<TicketInterface> {

	public findUnassignedTickets(): TicketInterface[] {
		return [...this.getCache().values()]
			.filter(ticket => !ticket.assignTo);
	}

	public findTicketAssignTo(name: string): TicketInterface | undefined {
		const tickets = [...this.getCache().values()]
		return tickets.find(ticket => ticket.assignTo === name);
	}

}

export const TicketRepository = TicketRepositoryImpl as unknown as RepositoryClass<TicketRepositoryImpl>;