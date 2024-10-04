import {ETypeCreep} from "../ETypeCreep";
import {BasicAI} from "../ai/basic/BasicAI";
import {LogService} from "./LogService";
import {BeanService} from "./bean/BeanService";
import {EService} from "./bean/EService";
import {LoggingDecorator} from "./decorators/LoggingDecorator";
import {UnemployedAI} from "../ai/unemployed/UnemployedAI";

@LoggingDecorator()
export class CreepAIFactory {

  private logService: LogService;

  constructor() {
    this.logService = BeanService.getService<LogService>(EService.LogService);
  }


  public runCreepIA(memory: CreepMemory): void {
    if (memory == null) {
      return;
    }
    if (memory.assignedTo == null) {
      new UnemployedAI(memory).run();
      return;
    }
    switch (memory.type) {
      case ETypeCreep.BASIC:
        new BasicAI(memory).run();
        break;
      default:
        this.logService.warn(`Could not find AI for creep ${memory.name}`);
        break;
    }
  }

}