import { LEVELS } from "../../../shared/constants/logger.constant";
import {
    ILoggerOptions,
    TLevelLogger,
} from "../../../shared/types/logger.type";
import FormattedLogger from "./FormatLogger";

export default class ConsoleLogger extends FormattedLogger {
    constructor(opts: ILoggerOptions["options"]) {
        super(opts);

        this.maxPrefixLength = 0;
    }

    getLogHandler(
        bindings: any,
    ): ((type: TLevelLogger, args: any) => void) | null {
        const level = bindings ? this.getLogLevel(bindings.mod) : null;
        if (!level) return null;

        const levelIdx = LEVELS.indexOf(level);
        const formatter = this.getFormatter(bindings);

        return (type: TLevelLogger, args: any): void => {
            const typeIdx = LEVELS.indexOf(type);
            // Skip if the log config is higher than the log level runtime
            if (typeIdx > levelIdx) return;

            const pargs = formatter(type, args);
            switch (type) {
                case "fatal":
                case "error":
                    return console.error(...pargs);
                case "warn":
                    return console.warn(...pargs);
                default:
                    return console.log(...pargs);
            }
        };
    }
}
