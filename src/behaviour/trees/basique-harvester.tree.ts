import {Selector} from "../selector";
import {Sequence} from "../sequence";
import {HasEnoughEnergyCondition} from "../conditions/has-enough-energy.condition";
import {MoveToClosestSourceAction} from "../actions/move-to/move-to-closest-source.action";
import {HarvestEnergyAction} from "../actions/harvest-energy.action";
import {MoveToClosestSpawnAction} from "../actions/move-to/move-to-closest-spawn.action";
import {TransferEnergyToSpawnAction} from "../actions/transfer-energy-to-spawn.action";

export const basiqueHarvesterTree = new Selector([
    new Sequence([
        new HasEnoughEnergyCondition({threshold: 50}),
        new MoveToClosestSpawnAction(),
        new TransferEnergyToSpawnAction()
    ]),
    new Sequence([
        new MoveToClosestSourceAction(),
        new HarvestEnergyAction()
    ])
]);