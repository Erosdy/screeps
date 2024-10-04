import {EService} from "./EService";
import {LogService} from "../LogService";
import {CreepService} from "../CreepService";
import {TicketService} from "../TicketService";
import {CreepAIFactory} from "../CreepAIFactory";
import {StructureAIFactory} from "../StructureAIFactory";

export class BeanService {

  private static services: Map<EService, any> = new Map();

  public static initServices(): void {
    BeanService.addService(EService.LogService, new LogService());
    BeanService.addService(EService.CreepService, new CreepService());
    BeanService.addService(EService.TicketService, new TicketService());
    BeanService.addService(EService.CreepAIFactory, new CreepAIFactory());
    BeanService.addService(EService.StructureAIFactory, new StructureAIFactory());
  }

  public static closeServices(): void {
    BeanService.getService<TicketService>(EService.TicketService).saveEntities();
    BeanService.getService<CreepService>(EService.CreepService).saveEntities();
  }

  public static addService(name: EService, service: any): void {
    BeanService.services.set(name, service);
  }

  public static getService<T>(name: EService): T {
    const result = this.services.get(name);
    if (!result) {
      throw new Error(`Service ${name} not found`);
    }
    return result as T;
  }

}