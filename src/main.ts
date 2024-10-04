import {ErrorMapper} from "utils/ErrorMapper";
import {BeanService} from "./services/bean.service/bean.service";
import {LogLevelEnum} from "./services/log.service/log.level.enum";

declare global {
  interface Memory {
    logLevel: LogLevelEnum;
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  BeanService.init();

  BeanService.closeServices();
});
