import {BehaviourNode} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";

export class HarvestEnergyAction implements BehaviourNode {

	public tick(creep: Creep): TaskStatusEnum {
		const source: Source | null = creep.pos.findClosestByPath(FIND_SOURCES);
		if (source == null) {
			return TaskStatusEnum.FAILURE;
		}

		if (!creep.pos.inRangeTo(source, 1)) {
			return TaskStatusEnum.FAILURE;
		}

		const retour = creep.harvest(source);
		if (retour === OK || retour === ERR_TIRED) {
			return TaskStatusEnum.SUCCESS;
		}

		return TaskStatusEnum.FAILURE;
	}

}