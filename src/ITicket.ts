import {ETypeCreep} from "./ETypeCreep";

export interface ITicket {
  id: string;
  spawnName: string;
  creepType: ETypeCreep;
  reservedBy?: string;
}