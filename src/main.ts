import {ErrorMapper} from "utils/ErrorMapper";
import {BeanService} from "./services/bean.service/bean.service";
import {LogLevelEnum} from "./services/log.service/log.level.enum";

declare global {
  interface Memory {
    creeps: { [name: string]: CreepMemory };
    rooms: { [name: string]: RoomMemory };
    spawns: { [name: string]: SpawnMemory };
    config: ConfigMemory;
  }

  interface CreepMemory {
  }

  interface RoomMemory {
  }

  interface SpawnMemory {
  }

  interface ConfigMemory {
    logLevel: LogLevelEnum;
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  BeanService.init();

  BeanService.closeServices();
});
