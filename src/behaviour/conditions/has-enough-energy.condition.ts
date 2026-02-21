import {BehaviourNode} from "../behaviour-node.interface";
import {TaskStatusEnum} from "../task-status.enum";

export class HasEnoughEnergyCondition implements BehaviourNode {

    private readonly THRESHOLD_DEFAULT_VALUE: number = 50;
    private readonly threshold: number;

    constructor(args: { threshold?: number; }) {
        this.threshold = args.threshold ?? this.THRESHOLD_DEFAULT_VALUE;
    }

    public tick(creep: Creep): TaskStatusEnum {
        return creep.store.getUsedCapacity(RESOURCE_ENERGY) >= this.threshold
            ? TaskStatusEnum.SUCCESS
            : TaskStatusEnum.FAILURE;
    }


}