import {TicketTypeEnum} from "../../ticket/ticket-type.enum";
import {Selector} from "../selector";
import {harvesterTree} from "./harvester.tree";
import {builderTree} from "./builder.tree";
import {upgraderTree} from "./upgrader.tree";
import {repairerTree} from "./repairer.tree";

export class TreeFactory {

	private static _instance: TreeFactory;

	static getInstance(): TreeFactory {
		if (this._instance == null) {
			this._instance = new TreeFactory();
		}
		return this._instance;
	}

	public getTree(type: TicketTypeEnum): Selector {
		switch (type) {
			case TicketTypeEnum.HARVEST:
				return harvesterTree;
			case TicketTypeEnum.BUILD:
				return builderTree;
			case TicketTypeEnum.UPGRADE:
				return upgraderTree;
			case TicketTypeEnum.REPAIR:
				return repairerTree;
			default:
				throw new Error(`Unsupported type ${type}`);
		}
	}


}