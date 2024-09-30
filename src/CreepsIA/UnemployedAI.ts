import {ICreepsAI} from "./ICreepsAI";
import {TicketService} from "../service/TicketService";
import {BeanService} from "../service/bean/BeanService";
import {EService} from "../service/bean/EService";
import {LogService} from "../service/LogService";
import {CreepService} from "../service/CreepService";


export class UnemployedAI implements ICreepsAI {

  private memory : CreepMemory;
  private ticketService: TicketService;
  private logService: LogService;
  private creepService : CreepService;

  constructor(memory: CreepMemory) {
    this.memory = memory;
    this.ticketService = BeanService.getService<TicketService>(EService.TicketService);
    this.logService = BeanService.getService<LogService>(EService.LogService);
    this.creepService = BeanService.getService<CreepService>(EService.CreepService);
  }

  public run(): void {
    const tickets = this.ticketService.getUnassignedTickets(this.memory.spawnName, this.memory.type);
    if (!tickets.length) {
      this.logService.warn(`No tickets available for ${this.memory.name}`);
      return;
    }
    const ticket = tickets[0];
    ticket.reservedBy = this.memory.name;
    this.ticketService.save(ticket);
    this.creepService.save(this.memory);
  }

}