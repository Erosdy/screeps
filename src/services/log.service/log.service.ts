import {AbstractService} from "../abstract.service";
import {LogLevelEnum} from "./log.level.enum";
import {ColorEnum} from "./color.enum";

export class LogService extends AbstractService {

  private static readonly DEFAULT_LOG_LEVEL: LogLevelEnum = LogLevelEnum.INFO;
  private logLevel: LogLevelEnum = LogService.DEFAULT_LOG_LEVEL;

  public init() {
    if (Memory.config == null) {
      Memory.config = {} as any;
    }
    if (Memory.config.logLevel == null) {
      Memory.config.logLevel = LogService.DEFAULT_LOG_LEVEL;
    }
    this.logLevel = Memory.config.logLevel;
  }

  public close() {
    Memory.config.logLevel = this.logLevel;
  }

  public log(message: unknown, level: LogLevelEnum) {
    switch (level) {
      case LogLevelEnum.ERROR:
        this.error(message);
        break;
      case LogLevelEnum.WARNING:
        this.warn(message);
        break;
      case LogLevelEnum.INFO:
        this.info(message);
        break;
      case LogLevelEnum.DEBUG:
        this.debug(message);
        break;
    }
  }

  public error(message: unknown): void {
    if (this.logLevel < LogLevelEnum.ERROR) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Red, this.format(stack.service, stack.method, message));
  }

  public warn(message: unknown): void {
    if (this.logLevel < LogLevelEnum.WARNING) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Orange, this.format(stack.service, stack.method, message));
  }

  public info(message: unknown): void {
    if (this.logLevel < LogLevelEnum.INFO) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Yellow, this.format(stack.service, stack.method, message));
  }

  public debug(message: unknown): void {
    if (this.logLevel < LogLevelEnum.DEBUG) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Cyan, this.format(stack.service, stack.method, message));
  }

  private getStack(): { method: string, service: string } {
    const stack = (new Error()).stack?.split("\n")[3]?.trim().split(" ")[1] ?? "";
    const parent_method = stack.split(".")[1] ? `${stack.split(".")[1]}()` : "unknown";
    const service_name = stack.split(".")[0] ?? "unknown";

    return {method: parent_method, service: service_name};
  }

  private message(color: ColorEnum, message: string): void {
    console.log(`<span style='color:${color}'>${message}</span>`)
  }

  private format(service: string, method: string, message: unknown): string {
    const to_display = typeof message === "string" ? message : JSON.stringify(message);
    return `${Game.time}\t-\t${service}\t-\t${method}\t-\t${to_display}`;
  }
}