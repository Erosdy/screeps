import {AbstractService} from "../abstract.service";
import {LogLevelEnum} from "./log.level.enum";
import {ColorEnum} from "./color.enum";
import {ConfigService} from "../config.service/config.service";
import {BeanService} from "../bean.service/bean.service";
import {ServiceEnum} from "../bean.service/service.enum";

export class LogService extends AbstractService {

  public static readonly DEFAULT_LOG_LEVEL: LogLevelEnum = LogLevelEnum.INFO;
  private configService?: ConfigService;

  public init() {
    this.configService = BeanService.getService<ConfigService>(ServiceEnum.CONFIG_SERVICE);
  }

  public getLogLevel(): LogLevelEnum {
    return this.getConfigService().getLogLevel();
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
    if (this.getLogLevel() < LogLevelEnum.ERROR) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Red, this.format(stack.service, stack.method, message));
  }

  public warn(message: unknown): void {
    if (this.getLogLevel() < LogLevelEnum.WARNING) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Orange, this.format(stack.service, stack.method, message));
  }

  public info(message: unknown): void {
    if (this.getLogLevel() < LogLevelEnum.INFO) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Yellow, this.format(stack.service, stack.method, message));
  }

  public debug(message: unknown): void {
    if (this.getLogLevel() < LogLevelEnum.DEBUG) {
      return;
    }
    const stack = this.getStack();
    this.message(ColorEnum.Cyan, this.format(stack.service, stack.method, message));
  }

  private getConfigService(): ConfigService {
    if (this.configService == null) {
      throw new Error("Could not get configuration service: config service has not been initialized");
    }
    return this.configService;
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