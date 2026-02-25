import {TicketPriorityEnum} from "./ticket-priority.enum";
import {TicketTypeEnum} from "./ticket-type.enum";
import {EntiteInterface} from "../repositories/entite.interface";

export type TicketInterface = BuilderTicket | RepairerTicket | UpgraderTicket | ContainerFillerTicket;

interface BaseTicketInterface<T extends TicketTypeEnum> extends EntiteInterface {
	type: T;
	priority: TicketPriorityEnum;
	assignTo?: string;
}

export interface BuilderTicket extends BaseTicketInterface<TicketTypeEnum.BUILD> {
	targetId: Id<ConstructionSite>;
}

export interface RepairerTicket extends BaseTicketInterface<TicketTypeEnum.REPAIR> {
	targetId: Id<Structure>;
}

export interface UpgraderTicket extends BaseTicketInterface<TicketTypeEnum.UPGRADE> {
	targetId: Id<StructureController>;
}

export interface ContainerFillerTicket extends BaseTicketInterface<TicketTypeEnum.FILL_CONTAINER> {
	targetId: Id<StructureStorage | StructureContainer>;
}