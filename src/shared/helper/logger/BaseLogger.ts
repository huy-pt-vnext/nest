import _ from "lodash";
import {
    ILoggerOptions,
    TLevelLogger,
} from "../../../shared/types/logger.type";
import util from "../../../shared/util";

export abstract class BaseLogger {
    opts: Record<any, any>;
    Promise: PromiseConstructor;
    maxPrefixLength: number;
    objectPrinter: any;
    levelColorStr: any;

    constructor(opts: ILoggerOptions["options"]) {
        this.opts = _.defaultsDeep(opts, {
            level: "info",
            createLogger: null,
        });
        this.Promise = Promise;
    }

    abstract init(): void;
    getLogLevel(mod: string): TLevelLogger | null {
        const level = this.opts.level as
            | TLevelLogger
            | Record<string, TLevelLogger>;
        if (_.isString(level)) {
            return level as TLevelLogger;
        }

        mod = mod ? mod.toUpperCase() : "";
        if (_.isObject(level)) {
            const tempLevel = level as Record<string, TLevelLogger>;
            if (mod && tempLevel[mod]) {
                return tempLevel[mod];
            }

            // Find with matching
            const key = _.keys(tempLevel).find(
                (m: string) => util.match(mod, m) && m !== "**",
            );
            if (key) return tempLevel[key];
            else if (tempLevel["**"]) {
                return tempLevel["**"];
            }
        }

        return null;
    }

    abstract getLogHandler(
        _bindings: any,
    ): ((type: TLevelLogger, args: any) => void) | null;
}
