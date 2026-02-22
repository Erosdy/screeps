import {Selector} from "../selector";
import {Sequence} from "../sequence";
import {HasEnergyCondition} from "../conditions/has-energy.condition";
import {MoveToTargetAction} from "../actions/move-to/move-to-target.action";
import {MoveToEnergyContainerAction} from "../actions/move-to/move-to-energy-container.action";
import {WithdrawEnergyAction} from "../actions/withdraw-energy.action";
import {UpgradeAction} from "../actions/upgrade.action";

export const upgraderTree = new Selector([
    new Sequence([
        new HasEnergyCondition(),
        new MoveToTargetAction(),
        new UpgradeAction({isLastNode: true})
    ]),
    new Sequence([
        new MoveToEnergyContainerAction(),
        new WithdrawEnergyAction()
    ])
]);