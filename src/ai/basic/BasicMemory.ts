import {EBasicState} from "./EBasicState";
import {BasicTicket} from "./BasicTicket";

export interface BasicMemory extends CreepMemory {
  assignedTo?: BasicTicket;
  state?: EBasicState;
}