import {ILoggable} from "./loggable.interface";
import {ELogColor} from "./log-color.enum";
import {ELogLevel} from "./log-level.enum";
import {configurationRepository} from "../repositories/configuration.repository";

export interface ILogService {
	debug(context: ILoggable | undefined, message: string, ...args: unknown[]): void;

	info(context: ILoggable | undefined, message: string, ...args: unknown[]): void;

	warn(context: ILoggable | undefined, message: string, ...args: unknown[]): void;

	error(context: ILoggable | undefined, message: string, ...args: unknown[]): void;
}

export const log: ILogService = {
	debug(context: ILoggable | undefined, message: string, ...args) {
		const _context: _ILogContexte = {
			context,
			level: ELogLevel.DEBUG,
			message,
			args
		}
		_processLog(_context);
	},
	info(context: ILoggable | undefined, message: string, ...args: unknown[]): void {
		const _context: _ILogContexte = {
			context,
			level: ELogLevel.INFO,
			message,
			args
		}
		_processLog(_context);
	},
	warn(context: ILoggable | undefined, message: string, ...args: unknown[]): void {
		const _context: _ILogContexte = {
			context,
			level: ELogLevel.WARN,
			message,
			args
		}
		_processLog(_context);
	},
	error(context: ILoggable | undefined, message: string, ...args: unknown[]): void {
		const _context: _ILogContexte = {
			context,
			level: ELogLevel.ERROR,
			message,
			args
		}
		_processLog(_context);
	},
}

interface _ILogContexte {
	context?: ILoggable;
	level: ELogLevel;
	message: string;
	args: unknown[];
}

/**
 * À partir d'un ILogContext fourni par le LogService, vérifie si le level de log est suffisant pour qu'un message soit
 * logué puis log les informations selon le format de logs défini dans la configuration.
 *
 * @param context
 */
const _processLog = function (context: _ILogContexte): void {
	if (!_canWrite(context.level)) {
		return;
	}
	const message = _formatLog(context);
	_writeLog(message, _getColorFromLogLevel(context.level));
}

/**
 * À partir d'un ILogContext fourni par le LogService, préfixe le message avec les informations contextuelles
 *
 * @param context
 */
const _formatLog = function (context: _ILogContexte): string {
	let id = " - ";
	if (context.context != null) {
		if (context.context.name != null) {
			id = context.context.name;
		} else {
			id = context.context.id;
		}
	}
	return `${ELogLevel[context.level]}\t${Game.time}\t${id}\t${_buildDynamicMessage(context.message, context.args)}`;
}

const _buildDynamicMessage = function (message: string, args: unknown[]) {
	for (const arg of args) {
		// JSON.stringify introduits des " autour de l'objet parsé, on les retire avant de les insérer dans la chaine de caractère
		const toAdd = JSON.stringify(arg).slice(1, -1);
		message = message.replace("{}", toAdd)
	}
	return message;
}

/**
 * À partir d'un log level, retourne la couleur des logs qui seront générés.
 *
 * @param level
 */
const _getColorFromLogLevel = function (level: ELogLevel): ELogColor {
	switch (level) {
		case ELogLevel.ERROR:
			return ELogColor.RED;
		case ELogLevel.WARN:
			return ELogColor.ORANGE;
		case ELogLevel.INFO:
			return ELogColor.YELLOW;
		case ELogLevel.DEBUG:
			return ELogColor.CYAN;
		default:
			return ELogColor.YELLOW;
	}
}

/**
 * Retourne un booléen qui indique si le level de log fourni en argument est suffisamment "sévère" pour être logué.
 *
 * @param logLevel
 */
const _canWrite = function (logLevel: ELogLevel): boolean {
	const currentLogLevel = configurationRepository.getLogLevel();
	return logLevel <= currentLogLevel;
}

/**
 * Ecris dans la console le message fourni selon la couleur donnée.
 *
 * @param message
 * @param color
 */
const _writeLog = function (message: string, color: ELogColor = ELogColor.YELLOW): void {
	console.log(`<span style='color:${color}'>${message}</span>`)
}