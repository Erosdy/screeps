import {ErrorMapper} from "utils/ErrorMapper";
import {BeanService} from "./service/bean/BeanService";

export const loop = ErrorMapper.wrapLoop(() => {
  BeanService.initServices();

  // const creepService = BeanService.getService<CreepService>(EService.CreepService);
  // const creepAIFactory = BeanService.getService<CreepAIFactory>(EService.CreepAIFactory);
  // const structureAIFactory = BeanService.getService<StructureAIFactory>(EService.StructureAIFactory);
  //
  // for (const spawnName in Game.spawns) {
  //   structureAIFactory.runStructureAI(spawnName);
  //   const memories = creepService.getAllCreepsMemories(spawnName);
  //   for (const memory of memories) {
  //     creepAIFactory.runCreepIA(memory);
  //   }
  // }

  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    const spawnMemory = spawn.memory;
  }


  BeanService.closeServices();
  console.log("\n\n");
});
