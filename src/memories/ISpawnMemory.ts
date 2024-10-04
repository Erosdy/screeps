import {ITicket} from "../ITicket";

declare global {
  interface SpawnMemory {
    tickets: ITicket[];
  }
}
