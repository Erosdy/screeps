export function LoggingDecorator<T>(): Function {
  return function (target: new (...args: any[]) => T) {
    const name = target.name;
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      if (key in logMethods) {
        continue;
      }
      const isMethod = target.prototype[key] instanceof Function;
      if (!isMethod) {
        continue;
      }
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        descriptor = Log()(name, key, descriptor);
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }
  }
}

export function Log(): (className: string, methodName: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return (className: string, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    let initialMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      StaticLog.debug(className, `${methodName}()`, `Enter with ${JSON.stringify(args)}`);
      try {
        const result = initialMethod.apply(this, args);
        StaticLog.debug(className, `${methodName}()`, `Exit with ${JSON.stringify(result)}`);
        return result;
      } catch (error: unknown) {
        const err = error as Error;
        let message = `Exit with Exception: ${err.message}`;
        if (err.stack != null && err.stack.length > 0) {
          message += `\n${err.stack}`;
        }
        StaticLog.debug(className, `${methodName}()`, `Exit with Exception: ${message}`);
        throw error;
      }
    }
    return descriptor;
  }
}

class StaticLog {

  public static error(service: string, method: string, message: string) {
    StaticLog.message("red", StaticLog.format(service, method, message));
  }

  public static warn(service: string, method: string, message: string) {
    StaticLog.message("orange", StaticLog.format(service, method, message));
  }

  public static log(service: string, method: string, message: string) {
    StaticLog.message("white", StaticLog.format(service, method, message));
  }

  public static info(service: string, method: string, message: string) {
    StaticLog.message("yellow", StaticLog.format(service, method, message));
  }

  public static debug(service: string, method: string, message: string) {
    StaticLog.message("cyan", StaticLog.format(service, method, message));
  }

  private static message(color: string, message: string): void {
    console.log(`<span style='color:${color}'>${message}</span>`)
  }

  private static format(service: string, method: string, message: string): string {
    return `${Game.time}\t-\t${service}\t-\t${method}\t-\t${message}`;
  }

}

const logMethods: string[] = [
  "error",
  "warn",
  "log",
  "info",
  "debug"
];



