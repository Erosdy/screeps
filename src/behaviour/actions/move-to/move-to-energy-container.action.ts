import {AbstractMoveTo} from "./move-to.abstract";

export class MoveToEnergyContainerAction extends AbstractMoveTo {

	protected findTarget(creep: Creep): RoomPosition | RoomObject | null {
		const containers = creep.room.find(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return 'store' in structure &&
					structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		if (containers.length == 0) {
			return null;
		}
		return containers[0];
	}
}