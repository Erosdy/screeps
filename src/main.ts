import {ErrorMapper} from "utils/ErrorMapper";
import {basiqueHarvesterTree} from "./behaviour/trees/basique-harvester.tree";

declare global {

}

export const loop = ErrorMapper.wrapLoop(() => {
    const spawns = Object.values(Game.spawns);
    const harvesters = Object.values(Game.creeps);

    if (harvesters.length < 5) {
        const spawn = spawns[0];
        if (spawn && !spawn.spawning) {
            const name = 'Harvester' + Game.time;
            spawn.spawnCreep([WORK, CARRY, MOVE], name);
        }
    }
    
    for (const name in Game.creeps) {
        const creep: Creep = Game.creeps[name];
        basiqueHarvesterTree.tick(creep);
    }
});
