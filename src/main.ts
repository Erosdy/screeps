import {ErrorMapper} from "utils/ErrorMapper";
import {BeanService} from "./services/bean.service/bean.service";
import {LogLevelEnum} from "./services/log.service/log.level.enum";

declare global {
  interface Memory {
    rooms: { [name: string]: RoomMemory };
    config: ConfigMemory;
  }

  interface RoomMemory {
    name: string;
    structures: StructureMemory[];
  }

  interface StructureMemory {
    name: string;
    type: StructureConstant;
    tickets: []; //TODO type à remplacer par ITickets[]
  }

  interface ConfigMemory {
    logLevel: LogLevelEnum;
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  BeanService.init();

  BeanService.closeServices();
});
