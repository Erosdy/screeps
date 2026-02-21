import {TicketRepository} from "../../ticket/ticket.repository";
import {TaskStatusEnum} from "../task-status.enum";
import {AbstractAction} from "./action.abstract";

export class BuildAction extends AbstractAction {

	public tick(creep: Creep): TaskStatusEnum {
		const target = this.findTarget(creep);
		if (target == null) {
			return TaskStatusEnum.FAILURE;
		}

		if (!creep.pos.inRangeTo(target, 3)) {
			return TaskStatusEnum.FAILURE;
		}

		const retour = creep.build(target);
		if (retour === OK) {
			return this.returnSuccess();
		}

		return TaskStatusEnum.FAILURE;
	}

	private findTarget(creep: Creep): ConstructionSite | null {
		const ticketRepository = TicketRepository.getInstance();
		const ticket = ticketRepository.findTicketAssignTo(creep.name);
		if (ticket == null) {
			return null;
		}
		const target = Game.getObjectById(ticket.targetId);
		if (target == null) {
			return null;
		}

		return target as ConstructionSite;
	}
}