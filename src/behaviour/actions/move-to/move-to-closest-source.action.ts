import {AbstractMoveTo} from "./move-to.abstract";

export class MoveToClosestSourceAction extends AbstractMoveTo {

    protected findTarget(creep: Creep): RoomPosition | RoomObject | null {
        return creep.pos.findClosestByPath(FIND_SOURCES);
    }
    
}