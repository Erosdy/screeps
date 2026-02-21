import {Selector} from "../selector";
import {Sequence} from "../sequence";
import {MoveToTargetAction} from "../actions/move-to/move-to-target.action";
import {BuildAction} from "../actions/build.action";
import {HasEnergyCondition} from "../conditions/has-energy.condition";
import {MoveToEnergyContainerAction} from "../actions/move-to/move-to-energy-container.action";
import {WithdrawEnergyAction} from "../actions/withdraw-energy.action";

export const builderTree = new Selector([
    new Sequence([
        new HasEnergyCondition(),
        new MoveToTargetAction(),
        new BuildAction({isLastNode: true})
    ]),
    new Sequence([
        new MoveToEnergyContainerAction(),
        new WithdrawEnergyAction()
    ])
]);