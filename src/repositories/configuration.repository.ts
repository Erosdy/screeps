import {ELogFormat} from "../log/log-format.enum";
import {ELogLevel} from "../log/log-level.enum";

export interface IConfigurationRepository {
	getLogFormat(): ELogFormat;

	getLogLevel(): ELogLevel;
}

export const configurationRepository: IConfigurationRepository = {

	getLogLevel(): ELogLevel {
		return ELogLevel.ALL;
	},

	getLogFormat(): ELogFormat {
		return ELogFormat.ENTRY_EXIT;
	}

}