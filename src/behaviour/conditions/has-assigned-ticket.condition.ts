import {BehaviourNodeInterface} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";
import {TicketRepository} from "../../ticket/ticket.repository";

export class HasAssignedTicketCondition implements BehaviourNodeInterface {

	public tick(creep: Creep): TaskStatusEnum {
		const ticketRepository = TicketRepository.getInstance();
		return ticketRepository.findTicketAssignTo(creep.name) == null ?
			TaskStatusEnum.FAILURE : TaskStatusEnum.SUCCESS;
	}

}