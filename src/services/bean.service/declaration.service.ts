import {ServiceEnum} from "./service.enum";
import {AbstractService} from "../abstract.service";
import {RoomService} from "../RoomService";
import {LogService} from "../log.service/log.service";

/**
 * Tous les services déclarés dans ce tableau seront initialisés dans le bean service
 * et utilisable via le bean service dans tout le projet après son init.
 */
export const declarationServices: { name: ServiceEnum, service: AbstractService }[] = [
  {name: ServiceEnum.ROOM_SERVICE, service: new RoomService()},
  {name: ServiceEnum.LOG_SERVICE, service: new LogService()}
]