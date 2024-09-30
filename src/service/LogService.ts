export class LogService {

  public error(message: string): void {
    const stack = this.getStack();
    this.message("red", this.format(stack.service, stack.method, message));
  }

  public warn(message: string): void {
    const stack = this.getStack();
    this.message("orange", this.format(stack.service, stack.method, message));
  }

  public log(message: string): void {
    const stack = this.getStack();
    this.message("white", this.format(stack.service, stack.method, message));
  }

  public info(message: string): void {
    const stack = this.getStack();
    this.message("yellow", this.format(stack.service, stack.method, message));
  }

  public debug(message: string): void {
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