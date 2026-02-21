import {AbstractTransferTo} from "./transfer-to.abstract";
import {TicketRepository} from "../../../ticket/ticket.repository";

export class TransferEnergyToTargetAction extends AbstractTransferTo {

	protected findTarget(creep: Creep): Structure | null {
		const ticketRepository = TicketRepository.getInstance();
		const ticket = ticketRepository.findTicketAssignTo(creep.name);
		if (ticket == null) {
			return null;
		}
		const target = Game.getObjectById(ticket.targetId);
		if (target == null) {
			return null;
		}

		// TODO à changer, le type doit être garanti via le ticket
		return target as Structure;
	}


}