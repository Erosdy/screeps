export interface BehaviourNode {
    tick(creep: Creep): TaskStatusEnum;
}