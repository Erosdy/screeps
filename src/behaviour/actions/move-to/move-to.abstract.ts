import {TaskStatusEnum} from "../../task-status.enum";
import {AbstractAction} from "../action.abstract";

export abstract class AbstractMoveTo extends AbstractAction {

    public tick(creep: Creep): TaskStatusEnum {
        const target = this.findTarget(creep);
        if (target == null) {
            return TaskStatusEnum.FAILURE;
        }

        if (creep.pos.inRangeTo(target, 1)) {
            return this.returnSuccess();
        }

        const retour = creep.moveTo(target, {visualizePathStyle: {lineStyle: "dashed"}});
        if (retour === OK || retour === ERR_TIRED) {
            return TaskStatusEnum.RUNNING;
        }

        return TaskStatusEnum.FAILURE;
    }

    protected abstract findTarget(creep: Creep): RoomPosition | RoomObject | null;

}