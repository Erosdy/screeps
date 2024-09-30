import {ErrorMapper} from "utils/ErrorMapper";
import {BeanService} from "./service/bean/BeanService";
import {EService} from "./service/bean/EService";
import {CreepService} from "./service/CreepService";
import {CreepAIFactory} from "./CreepsIA/CreepAIFactory";

export const loop = ErrorMapper.wrapLoop(() => {
  BeanService.initServices();

  const creepService = BeanService.getService<CreepService>(EService.CreepService);
  const creepAIFactory = BeanService.getService<CreepAIFactory>(EService.CreepAIFactory);
  for (const spawnName in Game.spawns) {
    const memories = creepService.getAllCreepsMemories(spawnName);
    for (const memory of memories) {
      const ai = creepAIFactory.buildCreepIA(memory);
      if (ai == null) {
        continue;
      }
      ai.run();
    }
  }

  BeanService.closeServices();
});
