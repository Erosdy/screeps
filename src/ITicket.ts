import {ETypeCreep} from "./ETypeCreep";

export interface ITicket {
  id: string;
  spawnName: string;
  creepType: ETypeCreep;
  emittedBy: string;
  reservedBy?: string;
}