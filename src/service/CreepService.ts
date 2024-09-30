import {LoggingDecorator} from "./decorators/LoggingDecorator";
import {LogService} from "./LogService";
import {EService} from "./bean/EService";
import {BeanService} from "./bean/BeanService";

@LoggingDecorator()
export class CreepService {

  private creeps: Map<string, CreepMemory[]>;
  private logService: LogService;

  constructor() {
    this.creeps = new Map<string, CreepMemory[]>();
    this.logService = BeanService.getService<LogService>(EService.LogService);
    this.init();
  }

  /**
   * Retourne toutes les mémoires de creeps associées à un spawn.
   * @param spawnName
   */
  public getAllCreepsMemories(spawnName: string): CreepMemory[] {
    const creeps = this.creeps.get(spawnName);
    if (creeps == null) {
      this.logService.info(`Could not find creeps related to spawn ${spawnName}`);
      return [];
    }
    return creeps;
  }

  /**
   * Sauvegarde la mémore de creep dans la map interne.
   * @param memory
   */
  public save(memory: CreepMemory): void {
    const creeps = this.creeps.get(memory.spawnName) ?? [];
    const index = creeps.findIndex(creep => creep.name === memory.name);
    if (index === -1) {
      creeps.push(memory);
    } else {
      creeps[index] = memory;
    }
    this.creeps.set(memory.name, creeps);
  }

  /**
   * Sauvegarde la map interne dans la mémoire global des creeps
   */
  public saveEntities(): void {
    this.creeps.forEach(memories => {
      for (const memory of memories) {
        Memory.creeps[memory.name] = memory;
      }
    });

  }

  private init(): void {
    for (const creepName in Game.creeps) {
      const memory = Memory.creeps[creepName];
      if (memory == null) {
        this.logService.warn(`Could not find memory for creep ${creepName}`);
        continue;
      }
      const creeps = this.creeps.get(memory.spawnName) ?? [];
      this.creeps.set(memory.spawnName, [...creeps, memory]);
    }
  }

}