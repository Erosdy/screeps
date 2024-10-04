import {ITicket} from "../../ITicket";

export interface BasicTicket extends ITicket {
  source: string;
  stockage: string;
  quantity: number;
}