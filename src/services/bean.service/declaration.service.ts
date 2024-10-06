import {ServiceEnum} from "./service.enum";
import {AbstractService} from "../abstract.service";
import {LogService} from "../log.service/log.service";
import {ConfigService} from "../config.service/config.service";
import {RoomService} from "../room.service/room.service";

/**
 * Tous les services déclarés dans ce tableau seront initialisés dans le bean service
 * et utilisable via le bean service dans tout le projet après son init.
 */
export const declarationServices: { name: ServiceEnum, service: AbstractService }[] = [
  {name: ServiceEnum.CONFIG_SERVICE, service: new ConfigService()},
  {name: ServiceEnum.ROOM_SERVICE, service: new RoomService()},
  {name: ServiceEnum.LOG_SERVICE, service: new LogService()},
]