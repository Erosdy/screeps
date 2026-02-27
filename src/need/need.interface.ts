import {EntiteInterface} from "../repositories/entite.interface";
import {TicketTypeEnum} from "../ticket/ticket-type.enum";

export type NeedInterface = BuildNeed | RepairNeed | UpgradeNeed | FillContainerNeed;

interface BaseNeedInterface<T extends TicketTypeEnum> extends EntiteInterface {
	type: T;
}

export interface BuildNeed extends BaseNeedInterface<TicketTypeEnum.BUILD> {
	targetId: Id<ConstructionSite>;
}

export interface RepairNeed extends BaseNeedInterface<TicketTypeEnum.REPAIR> {
	targetId: Id<Structure>;
}

export interface UpgradeNeed extends BaseNeedInterface<TicketTypeEnum.UPGRADE> {
	targetId: Id<StructureController>;
}

export interface FillContainerNeed extends BaseNeedInterface<TicketTypeEnum.FILL_CONTAINER> {
	targetId: Id<StructureStorage | StructureContainer>;
}