import {ICreepsAI} from "./ICreepsAI";
import {ETypeCreep} from "../ETypeCreep";
import {BasicAI} from "./BasicAI";
import {LogService} from "../service/LogService";
import {BeanService} from "../service/bean/BeanService";
import {EService} from "../service/bean/EService";
import {LoggingDecorator} from "../service/decorators/LoggingDecorator";
import {UnemployedAI} from "./UnemployedAI";

@LoggingDecorator()
export class CreepAIFactory {

  private logService: LogService;

  constructor() {
    this.logService = BeanService.getService<LogService>(EService.LogService);
  }


  public buildCreepIA(memory: CreepMemory): ICreepsAI | undefined {
    if (memory == null) {
      return undefined;
    }
    if (memory.assignedTo == null) {
      return new UnemployedAI(memory);
    }
    switch (memory.type) {
      case ETypeCreep.BASIC:
        return new BasicAI(memory);
      default:
        this.logService.warn(`Could not find AI for creep ${memory.name}`);
        return undefined;
    }
  }

}