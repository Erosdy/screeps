import {ITicket} from "../ITicket";
import {LoggingDecorator} from "./decorators/LoggingDecorator";
import {ETypeCreep} from "../ETypeCreep";
import {LogService} from "./LogService";
import {BeanService} from "./bean/BeanService";
import {EService} from "./bean/EService";


@LoggingDecorator()
export class TicketService {

  private static id: number = 0;

  private tickets: Map<string, ITicket[]>;
  private logService: LogService;

  constructor() {
    this.tickets = new Map<string, ITicket[]>();
    this.logService = BeanService.getService<LogService>(EService.LogService);
    this.init();
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
   * Retourne les tickets emis par une entité au sein de la room du spawn
   * @param spawnName
   * @param id
   */
  public getTicketsEmittedBy(spawnName: string, id: string): ITicket[] {
    return this.getAllTickets(spawnName)
      .filter(ticket => ticket.emittedBy === id);
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
   * Ajoute un ticket à la map interne
   * @param ticket
   */
  public addTicket(ticket: ITicket): void {
    const tickets = this.tickets.get(ticket.spawnName) ?? [];
    ticket.id = `${ticket.spawnName}_${ticket.emittedBy}_${TicketService.id}`;
    tickets.push(ticket);
    this.tickets.set(ticket.spawnName, tickets);
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
   * Supprime un ticket de la map interne
   * @param ticket
   */
  public delete(ticket: ITicket): void {
    const tickets = this.tickets.get(ticket.spawnName) ?? [];
    const index = tickets.findIndex(value => value.id === ticket.id);
    if (index != -1) {
      tickets.splice(index, 1);
    }
    this.tickets.set(ticket.spawnName, tickets);
  }

  /**
   * Sauvegarde tous les tickets dans la mémoire interne
   */
  public saveEntities(): void {
    for (const [spawn, tickets] of this.tickets.entries()) {
      console.log(JSON.stringify(tickets));
      Memory.spawns[spawn].tickets = tickets;
    }
  }

  private init() {
    for (const spawnName in Game.spawns) {
      if (Memory.spawns == null) {
        Memory.spawns = {};
      }
      const memory = Memory.spawns[spawnName];
      if (memory == null || memory.tickets == null) {
        this.logService.info(`Could not find memory for spawn ${spawnName}, initializing it`);
        Memory.spawns[spawnName] = {
          tickets: []
        };
        continue;
      }
      const tickets = this.tickets.get(spawnName) ?? [];
      this.tickets.set(spawnName, tickets);
    }
  }

}