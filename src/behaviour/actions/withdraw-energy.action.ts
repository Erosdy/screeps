import {AbstractAction} from "./action.abstract";
import {TaskStatusEnum} from "../task-status.enum";

export class WithdrawEnergyAction extends AbstractAction {

	public tick(creep: Creep): TaskStatusEnum {
		const container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return 'store' in structure &&
					structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
					creep.pos.inRangeTo(structure, 1);
			}
		});
		if (container == null) {
			return TaskStatusEnum.FAILURE;
		}
		const received = creep.withdraw(container, RESOURCE_ENERGY);
		if (received === OK) {
			return this.returnSuccess();
		}
		return TaskStatusEnum.FAILURE;
	}

}