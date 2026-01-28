import {TaskStatusEnum} from "./task-status.enum";

export interface BehaviourNode {
    tick(creep: Creep): TaskStatusEnum;
}