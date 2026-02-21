import {AbstractTransferTo} from "./transfer-to.abstract";

export class TransferEnergyToSpawnAction extends AbstractTransferTo {

	protected findTarget(creep: Creep): Structure | null {
		return creep.pos.findClosestByPath(FIND_MY_SPAWNS);
	}


}