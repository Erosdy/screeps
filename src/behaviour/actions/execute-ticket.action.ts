import {BehaviourNodeInterface} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";
import {TicketRepository} from "../../ticket/ticket.repository";
import {TreeFactory} from "../trees/tree.factory";
import {NeedFactory} from "../../need/need.factory";

export class ExecuteTicketAction implements BehaviourNodeInterface {

	public tick(creep: Creep): TaskStatusEnum {
		const ticketRepository = TicketRepository.getInstance();
		const ticket = ticketRepository.findTicketAssignTo(creep.name);
		if (ticket == null) {
			return TaskStatusEnum.FAILURE;
		}
		const treeFactory = TreeFactory.getInstance();
		const tree = treeFactory.getTree(ticket.type);
		if (tree == null) {
			return TaskStatusEnum.FAILURE;
		}
		const retour = tree.tick(creep);
		switch (retour) {
			case TaskStatusEnum.FINISH:
				ticketRepository.delete(ticket.id);
				return TaskStatusEnum.SUCCESS;
			case TaskStatusEnum.SUCCESS:
				return TaskStatusEnum.RUNNING;
			case TaskStatusEnum.RUNNING:
				return TaskStatusEnum.RUNNING;
			case TaskStatusEnum.FAILURE:
				// L'action a échoué, on régénère le besoin peut-être qu'il est toujours présent
				const needFactory = NeedFactory.getInstance();
				needFactory.generateNeed(ticket);
				ticketRepository.delete(ticket.id);
				return TaskStatusEnum.FAILURE;
		}
	}


}