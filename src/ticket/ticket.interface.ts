import {TicketPriorityEnum} from "./ticket-priority.enum";
import {TicketTypeEnum} from "./ticket-type.enum";


export interface TicketInterface {
	id: string;
	type: TicketTypeEnum;
	targetId: Id<_HasId & RoomObject>;
	priority: TicketPriorityEnum;
	assignTo?: string;
}