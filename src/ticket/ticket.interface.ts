import {TicketPriorityEnum} from "./ticket-priority.enum";
import {StateEnum} from "../enum/state.enum";

export interface TicketInterface {
	id: string;
	type: StateEnum;
	targetId: Id<_HasId & RoomObject>;	// TODO à changer, le type doit être garanti via le ticket
	priority: TicketPriorityEnum;
	assignTo?: string;
}