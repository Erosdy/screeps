import {ITicket} from "../ITicket";
import {LoggingDecorator} from "./decorators/LoggingDecorator";
import {ETypeCreep} from "../ETypeCreep";
import {LogService} from "./LogService";
import {BeanService} from "./bean/BeanService";
import {EService} from "./bean/EService";


@LoggingDecorator()
export class TicketService {

  private tickets: Map<string, ITicket[]>;
  private logService: LogService;

  constructor() {
    this.tickets = new Map<string, ITicket[]>();
    this.logService = BeanService.getService<LogService>(EService.LogService);
  }

  protected init() {
    for (const spawnName in Game.spawns) {
      const memory = Memory.spawns[spawnName];
      if (memory == null || memory.tickets == null) {
        this.logService.info(`Could not find memory for spawn ${spawnName}, initializing it`);
        continue;
      }
      const tickets = this.tickets.get(spawnName) ?? [];
      this.tickets.set(spawnName, tickets);
    }
  }


  /**
   * Retourne tous les tickets liés au spawn. Si les tickets ne sont pas initialisé dans la mémoire du spawn,
   * intialise les tickets.
   * Retourne un array vide si le nom du spawn n'existe pas.
   * @param spawnName Le nom du spawn duquel on veut récupérer les tickets
   */
  public getAllTickets(spawnName: string): ITicket[] {
    return this.tickets.get(spawnName) ?? [];
  }

  /**
   * Retourne un ticket si il existe en fonction de son id et du nom du spawn.
   * @param spawnName Le nom du spawn duquel on veut récupérer un ticket
   * @param id L'id du ticket.
   */
  public getTicketById(spawnName: string, id: string): ITicket | undefined {
    const tickets = this.getAllTickets(spawnName);
    if (tickets.length === 0){
      return undefined;
    } else if (tickets.length === 1) {
      return tickets[0];
    } else {
      this.logService.warn(`More than 1 ticket ${id} for spawn ${spawnName}, reinitialize its memory`);
      this.tickets.set(spawnName, []);
      return undefined;
    }
  }

  /**
   * Récupère tous les tickets d'un type non assignés associés au spawn donnée en argument.
   * @param spawnName Le nom du spawn duquel on veut récupérer les tickets non assignés.
   * @param type Le type des jobs
   */
  public getUnassignedTickets(spawnName: string, type: ETypeCreep): ITicket[] {
    return this.getAllTickets(spawnName)
      .filter(ticket => ticket.reservedBy === undefined)
      .filter(ticket => ticket.creepType === type);
  }

  /**
   * Sauvegarde un ticket dans la map interne
   * @param ticket
   */
  public save(ticket: ITicket): void {
    const tickets = this.tickets.get(ticket.spawnName) ?? [];
    const index = tickets.findIndex(value => value.id === ticket.id);
    if (index === -1) {
      tickets.push(ticket);
    } else {
      tickets[index] = ticket;
    }
    this.tickets.set(ticket.spawnName, tickets);
  }

  /**
   * Sauvegarde tous les tickets dans la mémoire interne
   */
  public saveEntities(): void {
    for (const [spawn, tickets] of this.tickets.entries()) {
      Memory.spawns[spawn].tickets = tickets;
    }
  }

}