import {NeedRepository} from "../need/need.repository";
import {TicketInterface} from "./ticket.interface";
import {NeedInterface} from "../need/need.interface";
import {TicketPriorityEnum} from "./ticket-priority.enum";
import {TicketRepository} from "./ticket.repository";
import {Singleton} from "../singleton/singleton.decorator";
import {SingletonClass} from "../singleton/singleton.type";

@Singleton
export class TicketFactoryImpl {

    public generateTicketsFromNeeds(): void {
        const needRepository = NeedRepository.getInstance();
        const needs = needRepository.findAll();
        if (needs.length == 0) {
            return;
        }
        const ticketRepository = TicketRepository.getInstance();
        for (const need of needs) {
            const ticket = this.generateFromNeed(need);
            ticketRepository.save(ticket);
            needRepository.delete(need.id);
        }
    }

    private generateFromNeed(need: NeedInterface): TicketInterface {
        return {
            ...need,
            priority: TicketPriorityEnum.DEFAULT
        }
    }
}

export const TicketFactory = TicketFactoryImpl as unknown as SingletonClass<TicketFactoryImpl>;