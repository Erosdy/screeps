import {BehaviourNodeInterface} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";

export abstract class AbstractAction implements BehaviourNodeInterface {

	protected isLastNode: boolean;

	constructor(args?: { isLastNode?: boolean }) {
		this.isLastNode = args?.isLastNode ?? false;
	}

	public abstract tick(creep: Creep): TaskStatusEnum;

	protected returnSuccess(): TaskStatusEnum {
		if (this.isLastNode) {
			return TaskStatusEnum.FINISH;
		}
		return TaskStatusEnum.SUCCESS;
	}

}