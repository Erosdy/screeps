import {AbstractMoveTo} from "./move-to.abstract";

export class MoveToClosestSpawnAction extends AbstractMoveTo {

    protected findTarget(creep: Creep): RoomPosition | RoomObject | null {
        return creep.pos.findClosestByPath(FIND_MY_SPAWNS);
    }
    
}