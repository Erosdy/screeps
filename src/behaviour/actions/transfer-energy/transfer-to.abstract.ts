import {TaskStatusEnum} from "../../task-status.enum";
import {AbstractAction} from "../action.abstract";

export abstract class AbstractTransferTo extends AbstractAction {

	public tick(creep: Creep): TaskStatusEnum {
		const target = this.findTarget(creep);
		if (target == null) {
			return TaskStatusEnum.FAILURE;
		}
        
		if (!creep.pos.inRangeTo(target, 1)) {
			return TaskStatusEnum.FAILURE;
		}

		const retour = creep.transfer(target, RESOURCE_ENERGY);
		if (retour === OK) {
			return this.returnSuccess();
		}
		return TaskStatusEnum.FAILURE;
	}

	protected abstract findTarget(creep: Creep): Structure | null;

}