import {LoggingDecorator} from "./decorators/LoggingDecorator";
import {LogService} from "./LogService";
import {BeanService} from "./bean/BeanService";
import {EService} from "./bean/EService";
import {TicketService} from "./TicketService";
import {ETypeCreep} from "../ETypeCreep";
import {BasicTicket} from "../ai/basic/BasicTicket";

@LoggingDecorator()
export class StructureAIFactory {

  private logService: LogService;
  private ticketService: TicketService;

  constructor() {
    this.logService = BeanService.getService<LogService>(EService.LogService);
    this.ticketService = BeanService.getService<TicketService>(EService.TicketService);
  }

  public runStructureAI(spawnName: string): void {
    this.runStockageStructureAI(spawnName);
  }

  public runStockageStructureAI(spawnName: string): void {
    const room = Game.spawns[spawnName].room;
    const spawns = room.find<StructureSpawn>(FIND_MY_STRUCTURES, {
      filter: {structureType: STRUCTURE_SPAWN}
    });
    const extensions = room.find<StructureExtension>(FIND_MY_STRUCTURES, {
      filter: {structureType: STRUCTURE_EXTENSION}
    });
    const sources = room.find(FIND_SOURCES_ACTIVE, {
      filter: (source) => source.energy > 300
    });
    if (sources.length === 0) {
      this.logService.error(`No source with enough energy found on room ${room.name}`);
      return;
    }
    for (const struct of [...spawns, ...extensions]) {
      const energy = struct.store.getFreeCapacity(RESOURCE_ENERGY);
      const tickets = this.ticketService.getTicketsEmittedBy(spawnName, struct.id)
        .filter(ticket => ticket.creepType === ETypeCreep.BASIC);
      console.log(struct);
      console.log(energy);
      console.log(tickets.length);
      console.log(sources);
      if (energy > 0 && tickets.length === 0) {
        this.logService.debug(`Missing some energy on structure ${struct.id}, creating a ticket`);
        const ticket = {
          spawnName: spawnName,
          creepType: ETypeCreep.BASIC,
          emittedBy: `${struct.id}`,
          quantity: energy,
          source: `${sources[0].id}`,
          stockage: `${struct.id}`
        } as BasicTicket;
        this.ticketService.addTicket(ticket);
      }
    }
  }
}