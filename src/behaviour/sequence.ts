import {BehaviourNode} from "./behaviour-node.interface";
import {TaskStatusEnum} from "./task-status.enum";

export class Sequence implements BehaviourNode {

	private readonly nodes: BehaviourNode[];

	constructor(nodes: BehaviourNode[]) {
		this.nodes = nodes;
	}

	public tick(creep: Creep): TaskStatusEnum {
		for (const node of this.nodes) {
			const status = node.tick(creep);
			if (status !== TaskStatusEnum.SUCCESS) {
				return status;
			}
		}
		return TaskStatusEnum.SUCCESS;
	}

}