import {TaskStatusEnum} from "./task-status.enum";

export interface BehaviourNodeInterface {
	tick(creep: Creep): TaskStatusEnum;
}