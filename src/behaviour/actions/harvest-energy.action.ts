import {TaskStatusEnum} from "../task-status.enum";
import {AbstractAction} from "./action.abstract";

export class HarvestEnergyAction extends AbstractAction {

    public tick(creep: Creep): TaskStatusEnum {
        const source: Source | null = creep.pos.findClosestByPath(FIND_SOURCES);
        if (source == null) {
            return TaskStatusEnum.FAILURE;
        }

        if (!creep.pos.inRangeTo(source, 1)) {
            return TaskStatusEnum.FAILURE;
        }

        const retour = creep.harvest(source);
        if (retour === OK || retour === ERR_TIRED) {
            return this.returnSuccess();
        }

        return TaskStatusEnum.FAILURE;
    }

}