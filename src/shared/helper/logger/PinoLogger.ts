import _ from "lodash";
import Pino, { Logger } from "pino";
import {
    ILoggerBindings,
    ILoggerOptions,
} from "../../../shared/types/logger.type";
import { BaseLogger } from "./BaseLogger";

export default class PinoLogger extends BaseLogger {
    public pino!: Logger<never, boolean>;

    constructor(opts: ILoggerOptions["options"]) {
        super(opts);
        this.opts = _.defaultsDeep(this.opts, {
            pino: {
                options: null,
                destination: null,
            },
        });
    }

    init() {
        this.pino = Pino();
    }

    getLogHandler(bindings: ILoggerBindings) {
        let level = bindings ? this.getLogLevel(bindings.mod) : null;

        if (!level) return null;

        const logger = _.isFunction(this.opts.createLogger)
            ? this.opts.createLogger(level, bindings)
            : this.pino.child(bindings, { level });

        return (type: string, args: any) => {
            return logger[type](...args);
        };
    }
}
