import {TicketTypeEnum} from "../ticket/ticket-type.enum";

export interface InputInterface {
	type: TicketTypeEnum;
	targetId: Id<_HasId & RoomObject>;
}