import {AbstractService} from "../abstract.service";
import {LogLevelEnum} from "./log.level.enum";

export class LogService extends AbstractService {

  private static readonly DEFAULT_LOG_LEVEL: LogLevelEnum = LogLevelEnum.INFO;
  private logLevel: LogLevelEnum = LogService.DEFAULT_LOG_LEVEL;

  public init() {
    if (Memory.logLevel == null) {
      Memory.logLevel = LogService.DEFAULT_LOG_LEVEL;
    }
    this.logLevel = Memory.logLevel;
  }

  public close() {
    Memory.logLevel = this.logLevel;
  }

  public error(message: string): void {
    if (this.logLevel < LogLevelEnum.ERROR) {
      return;
    }
    const stack = this.getStack();
    this.message("red", this.format(stack.service, stack.method, message));
  }

  public warn(message: string): void {
    if (this.logLevel < LogLevelEnum.WARNING) {
      return;
    }
    const stack = this.getStack();
    this.message("orange", this.format(stack.service, stack.method, message));
  }

  public info(message: string): void {
    if (this.logLevel < LogLevelEnum.INFO) {
      return;
    }
    const stack = this.getStack();
    this.message("yellow", this.format(stack.service, stack.method, message));
  }

  public debug(message: string): void {
    if (this.logLevel < LogLevelEnum.DEBUG) {
      return;
    }
    const stack = this.getStack();
    this.message("cyan", this.format(stack.service, stack.method, message));
  }

  private getStack(): { method: string, service: string } {
    const stack = (new Error()).stack?.split("\n")[3]?.trim().split(" ")[1] ?? "";
    const parent_method = stack.split(".")[1] ? `${stack.split(".")[1]}()` : "unknown";
    const service_name = stack.split(".")[0] ?? "unknown";

    return {method: parent_method, service: service_name};
  }

  private message(color: string, message: string): void {
    console.log(`<span style='color:${color}'>${message}</span>`)
  }

  private format(service: string, method: string, message: string): string {
    return `${Game.time}\t-\t${service}\t-\t${method}\t-\t${message}`;
  }
}