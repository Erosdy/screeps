import {TicketTypeEnum} from "../../ticket/ticket-type.enum";
import {Selector} from "../selector";
import {fillContainerTree} from "./fill-container.tree";
import {builderTree} from "./builder.tree";
import {upgraderTree} from "./upgrader.tree";
import {repairerTree} from "./repairer.tree";
import {Singleton} from "../../singleton/singleton.decorator";
import {SingletonClass} from "../../singleton/singleton.type";

@Singleton
class TreeFactoryImpl {

	public getTree(type: TicketTypeEnum): Selector {
		switch (type) {
			case TicketTypeEnum.FILL_CONTAINER:
				return fillContainerTree;
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

export const TreeFactory = TreeFactoryImpl as unknown as SingletonClass<TreeFactoryImpl>;