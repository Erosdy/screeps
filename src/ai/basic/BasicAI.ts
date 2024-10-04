import {IEntityAI} from "../../IEntityAI";
import {BasicMemory} from "./BasicMemory";
import {EBasicState} from "./EBasicState";
import {LogService} from "../../service/LogService";
import {BeanService} from "../../service/bean/BeanService";
import {EService} from "../../service/bean/EService";
import {TicketService} from "../../service/TicketService";
import {CreepService} from "../../service/CreepService";
import {LoggingDecorator} from "../../service/decorators/LoggingDecorator";

@LoggingDecorator()
export class BasicAI implements IEntityAI {

  private readonly logService: LogService;
  private readonly ticketService: TicketService;
  private readonly creepService: CreepService;
  private readonly memory: BasicMemory;

  constructor(memory: CreepMemory) {
    this.memory = memory as BasicMemory;
    this.logService = BeanService.getService<LogService>(EService.LogService);
    this.ticketService = BeanService.getService<TicketService>(EService.TicketService);
    this.creepService = BeanService.getService<CreepService>(EService.CreepService);
  }

  public run(): void {
    if (this.memory.state == null) {
      this.memory.state = EBasicState.TO_SOURCE;
    }
    const ticket = this.memory.assignedTo;
    if (ticket == null) {
      this.logService.error(`Could not execute BasicAI: no ticket found on ${this.memory.name}'s memory`);
      return;
    }
    const sources = Game.spawns[ticket.spawnName].room.find(FIND_SOURCES)
      .filter(source => source.id === ticket.source);
    if (sources.length != 1) {
      this.logService.error(`Could not execute BasicAI: no source on ticket ${ticket.id}`);
      this.memory.state = EBasicState.END;
    }
    const source = sources[0];
    const stockage = Game.structures[ticket.stockage];
    if (stockage == null) {
      this.logService.error(`Could not execute BasicAI: no stockage on ticket ${ticket.id}`);
      this.memory.state = EBasicState.END;
    }

    const quantity = ticket.quantity;
    if (quantity == null) {
      this.logService.error(`Could not execute BasicAI: no quantity on ticket ${ticket.id}`);
      this.memory.state = EBasicState.END;
    }

    const creep = Game.creeps[this.memory.name];
    if (creep == null) {
      this.logService.error(`Could not execute BasicAI: no creep ${this.memory.name} found.`);
      this.memory.state = EBasicState.END;
    }
    switch (this.memory.state) {
      case EBasicState.TO_SOURCE:
        this.moveToSource(creep, source);
        break;
      case EBasicState.HARVESTING:
        this.harvest(creep, source, quantity);
        break;
      case EBasicState.TO_STOCKAGE:
        this.moveToStockage(creep, stockage);
        break;
      case EBasicState.TRANSFERT:
        this.transfer(creep, stockage);
        break;
      case EBasicState.END:
        this.logService.log(`Ticket ${ticket.id} ended`);
        this.ticketService.delete(ticket);
        this.memory.assignedTo = undefined;
        break;
    }
    this.creepService.save(this.memory);
  }

  private moveToSource(creep: Creep, source: Source): void {
    const result = creep.moveTo(source);
    if (result != OK) {
      this.logService.error(`[${this.memory.name}] - Could not execute BasicAI: could not move to source ${source.id} (ERR_${result})`);
    }
    if (creep.pos.inRangeTo(source.pos, 1)) {
      this.memory.state = EBasicState.HARVESTING;
    }
  }

  private harvest(creep: Creep, source: Source, quantity: number): void {
    const result = creep.harvest(source);
    if (result != OK) {
      this.logService.error(`[${this.memory.name}] - Could not execute BasicAI: could not harvest source ${source.id} (ERR_${result})`);
    }
    if (creep.store.getFreeCapacity() === 0 || creep.store.getUsedCapacity() >= quantity) {
      this.memory.state = EBasicState.TO_STOCKAGE;
    }
  }

  private moveToStockage(creep: Creep, stockage: Structure): void {
    const result = creep.moveTo(stockage);
    if (result != OK) {
      this.logService.error(`[${this.memory.name}] - Could not execute BasicAI: could not move to stockage ${stockage.id} (ERR_${result})`);
    }
    if (creep.pos.inRangeTo(stockage.pos, 1)) {
      this.memory.state = EBasicState.TRANSFERT;
    }
  }

  private transfer(creep: Creep, stockage: Structure): void {
    const result = creep.transfer(stockage, RESOURCE_ENERGY);
    if (result != OK) {
      this.logService.error(`[${this.memory.name}] - Could not execute BasicAI: could not transfer energy to stockage ${stockage.id} (ERR_${result})`);
    }
    this.memory.state = EBasicState.END;
  }

}