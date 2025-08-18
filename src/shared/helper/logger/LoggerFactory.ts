import _ from "lodash";
import { LEVELS } from "../../../shared/constants/logger.constant";
import { ILoggerBindings, TLogger } from "../../../shared/types/logger.type";
import { BaseLogger } from "./BaseLogger";

export default class LoggerFactory {
    public listInstanceLogger: BaseLogger[];

    public cache: Map<string, any>;

    constructor() {
        this.listInstanceLogger = [];
        this.cache = new Map();
    }

    init(instances: any[]) {
        this.listInstanceLogger = instances;
        this.listInstanceLogger.forEach((app) => app.init());
    }

    getLogger(bindings: ILoggerBindings, ...options: any) {
        const bindingsKey = this.getBindingsKey(bindings);
        let logger: TLogger = this.cache.get(bindingsKey);
        if (logger) return logger;

        logger = {} as any;
        const instances = this.listInstanceLogger;

        const logHandlers = _.compact(
            instances.map((instance) => instance.getLogHandler(bindings)),
        );

        LEVELS.forEach((level) => {
            logger[level] = (...args: any) => {
                if (logHandlers.length == 0) return;

                if (options && options.length > 0) {
                    args = [...options, ...args];
                }

                for (let i = 0; i < logHandlers.length; i++)
                    logHandlers[i](level, args);
            };
        });

        this.cache.set(bindingsKey, logger);

        return logger;
    }

    getBindingsKey(bindings: ILoggerBindings) {
        if (!bindings) return "";
        return ["env", "service", "mod"]
            .map((key) => {
                return bindings[key as keyof ILoggerBindings];
            })
            .join("|");
    }
}
