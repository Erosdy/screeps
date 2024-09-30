import {ICreepsAI} from "./ICreepsAI";
import {BasicMemory} from "../memories/BasicMemory";

export class BasicAI implements ICreepsAI {

  private memory: BasicMemory;

  constructor(memory: CreepMemory) {
    this.memory = memory;
  }

  public run(): void {

  }

}