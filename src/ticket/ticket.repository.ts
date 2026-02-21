import {TicketInterface} from "./ticket.interface";

export class TicketRepository {
	private static _instance: TicketRepository;
	private _cache?: Map<string, TicketInterface>;

	static getInstance(): TicketRepository {
		if (this._instance == null) {
			this._instance = new TicketRepository();
		}
		return this._instance;
	}

	public findUnassignedTickets(): TicketInterface[] {
		return [...this.getCache().values()]
			.filter(ticket => !ticket.assignTo);
	}

	public findTicketAssignTo(name: string): TicketInterface | undefined {
		const tickets = [...this.getCache().values()]
		return tickets.find(ticket => ticket.assignTo === name);
	}


	public save(ticket: TicketInterface): void {
		this.getCache().set(ticket.id, ticket);
		Memory.tickets[ticket.id] = ticket;
	}

	public delete(ticket: TicketInterface): void {
		this.getCache().delete(ticket.id);
		delete Memory.tickets[ticket.id];
	}

	private getCache(): Map<string, TicketInterface> {
		if (this._cache == null) {
			this._cache = new Map(Object.entries(Memory.tickets ?? {}));
		}
		return this._cache;
	}
}