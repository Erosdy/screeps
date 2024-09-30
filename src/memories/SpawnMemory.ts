import {ITicket} from "../ITicket";
import {ETypeCreep} from "../ETypeCreep";

declare global {
  interface SpawnMemory {
    tickets: ITicket[];
    populations: [type: ETypeCreep, max: number];
  }
}
