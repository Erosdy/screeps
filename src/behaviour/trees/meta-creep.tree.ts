import {Selector} from "../selector";
import {Sequence} from "../sequence";
import {HasAssignedTicketCondition} from "../conditions/has-assigned-ticket.condition";
import {ExecuteTicketAction} from "../actions/execute-ticket.action";
import {FindTicketAction} from "../actions/find-ticket.action";

export const metaCreepTree: Selector = new Selector([
	new Sequence([
		new HasAssignedTicketCondition(),
		new ExecuteTicketAction()
	]),
	new FindTicketAction()
]);