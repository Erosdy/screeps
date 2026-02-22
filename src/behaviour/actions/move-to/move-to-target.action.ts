import {AbstractMoveTo} from "./move-to.abstract";
import {TicketRepository} from "../../../ticket/ticket.repository";

export class MoveToTargetAction extends AbstractMoveTo {

    public findTarget(creep: Creep): RoomPosition | RoomObject | null {
        const ticketRepository = TicketRepository.getInstance();
        const ticket = ticketRepository.findTicketAssignTo(creep.name);
        if (ticket == null) {
            return null;
        }
        const target = Game.getObjectById(ticket.targetId);
        if (target == null) {
            return null;
        }
        return target;
    }

}