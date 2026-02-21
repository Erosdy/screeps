import {AbstractAction} from "./action.abstract";
import {TaskStatusEnum} from "../task-status.enum";

export class UpgradeAction extends AbstractAction {

	public tick(creep: Creep): TaskStatusEnum {
		const controller = this.findTarget(creep);
		if (controller == null) {
			return TaskStatusEnum.FAILURE;
		}
		if (!creep.pos.inRangeTo(controller, 1)) {
			return TaskStatusEnum.FAILURE;
		}
		const received = creep.upgradeController(controller);
		if (received === OK || received === ERR_TIRED) {
			return this.returnSuccess();
		}
		return TaskStatusEnum.FAILURE;
	}

	private findTarget(creep: Creep): StructureController | undefined {
		return creep.room.controller;
	}

}