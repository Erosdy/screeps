import {BehaviourNode} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";

export class HasEnergyCondition implements BehaviourNode {

	public tick(creep: Creep): TaskStatusEnum {
		return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
			? TaskStatusEnum.SUCCESS
			: TaskStatusEnum.FAILURE;
	}

}