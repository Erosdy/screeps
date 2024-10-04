import {EService} from "../../enums/EService";
import {AbstractService} from "../AbstractService";
import {RoomService} from "../RoomService";
import {LogService} from "../LogService";

/**
 * Tous les services déclarés dans ce tableau seront initialisés dans le bean service
 * et utilisable via le bean service dans tout le projet après son init.
 */
export const declarationServices: { name: EService, service: AbstractService }[] = [
  {name: EService.RoomService, service: new RoomService()},
  {name: EService.LogService, service: new LogService()}
]