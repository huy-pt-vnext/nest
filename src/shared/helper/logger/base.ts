import { ILoggerOptions } from "../../../shared/types/logger.type";
import ConsoleLogger from "./ConsoleLogger";
import PinoLogger from "./PinoLogger";

const LOGGER = {
    Console: ConsoleLogger,
    Pino: PinoLogger,
} as const;

type TKeyInstanceLogger = keyof typeof LOGGER;
function getInstance<T extends TKeyInstanceLogger>(
    type: TKeyInstanceLogger,
): (typeof LOGGER)[T] {
    if (!type) {
        throw new Error(`Invalid logger configuration. Type: '${type}'`);
    }
    const instance = LOGGER[type];
    return instance as (typeof LOGGER)[T];
}

function resolve(opt: ILoggerOptions) {
    const LoggerClass = getInstance<typeof opt.type>(opt.type);
    return new LoggerClass(opt.options);
}

function register(name: keyof typeof LOGGER, value: any) {
    (LOGGER as any)[name] = value;
}
export { register, resolve };
