import {BehaviourNode} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";

export class TransferEnergyToSpawnAction implements BehaviourNode {

	public tick(creep: Creep): TaskStatusEnum {
		const spawn: StructureSpawn | null = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
		if (spawn == null) {
			return TaskStatusEnum.FAILURE;
		}

		if (!creep.pos.inRangeTo(spawn, 1)) {
			return TaskStatusEnum.FAILURE;
		}

		const retour = creep.transfer(spawn, RESOURCE_ENERGY);
		if (retour === OK) {
			return TaskStatusEnum.SUCCESS;
		}

		return TaskStatusEnum.FAILURE;
	}

}