import {ErrorMapper} from "utils/ErrorMapper";
import {InputInterface} from "./input/input.interface";
import {TicketInterface} from "./ticket/ticket.interface";
import {NeedInterface} from "./need/need.interface";
import {NeedFactory} from "./need/need.factory";
import {TicketFactory} from "./ticket/ticket.factory";
import {metaCreepTree} from "./behaviour/trees/meta-creep.tree";

declare global {
	interface Memory {
		inputs: InputInterface[];
		needs: Record<string, NeedInterface>
		tickets: Record<string, TicketInterface>
	}
}

export const loop = ErrorMapper.wrapLoop(() => {
	const needFactory = NeedFactory.getInstance();
	needFactory.generateNeedFromInputs();
	const ticketFactory = TicketFactory.getInstance();
	ticketFactory.generateTicketsFromNeeds();

	const spawns = Object.values(Game.spawns);
	const harvesters = Object.values(Game.creeps);

	if (harvesters.length < 1) {
		const spawn = spawns[0];
		if (spawn && !spawn.spawning) {
			const name = 'Basique' + Game.time;
			spawn.spawnCreep([WORK, CARRY, MOVE], name);
		}
	}

	for (const name in Game.creeps) {
		const creep: Creep = Game.creeps[name];
		metaCreepTree.tick(creep);
	}
});
