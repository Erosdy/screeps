import {ETypeCreep} from "../ETypeCreep";
import {ITicket} from "../ITicket";


declare global {
  interface CreepMemory {
    name: string;
    spawnName: string;
    type: ETypeCreep;
    assignedTo?: ITicket;
  }
}