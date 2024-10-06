import {AbstractService} from "../abstract.service";
import {LogLevelEnum} from "../log.service/log.level.enum";
import {LogService} from "../log.service/log.service";

export class ConfigService extends AbstractService {

  private memory?: ConfigMemory;

  public init() {
    if (Memory.config == null) {
      this.memory = {
        logLevel: LogService.DEFAULT_LOG_LEVEL
      }
    } else {
      this.memory = Memory.config;
    }
  }

  public close() {
    Memory.config = this.getMemory();
  }

  public getLogLevel(): LogLevelEnum {
    return this.getMemory().logLevel;
  }

  public setLogLevel(logLevel: LogLevelEnum): void {
    this.getMemory().logLevel = logLevel;
  }

  private getMemory(): ConfigMemory {
    if (this.memory == null) {
      throw new Error("Could not get memory: config service has not been initialized");
    }
    return this.memory;
  }
}