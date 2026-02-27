import {Selector} from "../selector";
import {Sequence} from "../sequence";
import {HasEnoughEnergyCondition} from "../conditions/has-enough-energy.condition";
import {MoveToClosestSourceAction} from "../actions/move-to/move-to-closest-source.action";
import {HarvestEnergyAction} from "../actions/harvest-energy.action";
import {MoveToTargetAction} from "../actions/move-to/move-to-target.action";
import {TransferEnergyToTargetAction} from "../actions/transfer-energy/transfer-energy-to-target.action";

export const fillContainerTree = new Selector([
	new Sequence([
		new HasEnoughEnergyCondition({threshold: 50}),
		new MoveToTargetAction(),
		new TransferEnergyToTargetAction({isLastNode: true})
	]),
	new Sequence([
		new MoveToClosestSourceAction(),
		new HarvestEnergyAction()
	])
]);