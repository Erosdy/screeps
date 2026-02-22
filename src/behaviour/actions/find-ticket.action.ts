import {BehaviourNodeInterface} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";
import {TicketRepository} from "../../ticket/ticket.repository";

export class FindTicketAction implements BehaviourNodeInterface {

	public tick(creep: Creep): TaskStatusEnum {
		const ticketRepository = TicketRepository.getInstance();
		const tickets = ticketRepository.findUnassignedTickets();
		if (tickets.length == 0) {
			return TaskStatusEnum.FAILURE;
		}

		// TODO ajouter la mécanique de choix du ticket, lié aux capacités du creep
		// ici tous les creeps sont identiques et peuvent tout faire, on prend
		// donc un ticket au hasard parmi les priorités les plus élevées.

		tickets.sort((a, b) => b.priority - a.priority);
		const ticket = tickets[0];
		ticket.assignTo = creep.name;
		ticketRepository.save(ticket);

		return TaskStatusEnum.SUCCESS;

	}

}