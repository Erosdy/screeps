import {BehaviourNode} from "../../behaviour-node.interface";
import {TaskStatusEnum} from "../../task-status.enum";

export abstract class AbstractMoveTo implements BehaviourNode {

    public tick(creep: Creep): TaskStatusEnum {
        const target = this.findTarget(creep);
        if (target == null) {
            return TaskStatusEnum.FAILURE;
        }

        if (creep.pos.inRangeTo(target, 1)) {
            return TaskStatusEnum.SUCCESS;
        }

        const retour = creep.moveTo(target);
        if (retour === OK || retour === ERR_TIRED) {
            return TaskStatusEnum.RUNNING;
        }

        return TaskStatusEnum.FAILURE;
    }

    protected abstract findTarget(creep: Creep): RoomPosition | RoomObject | null;

}