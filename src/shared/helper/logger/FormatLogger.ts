import kleur from "kleur";
import _ from "lodash";
import util from "util";
import { LEVELS } from "../../../shared/constants/logger.constant";
import {
    ILoggerBindings,
    ILoggerOptions,
    TLevelLogger,
} from "../../../shared/types/logger.type";
import { BaseLogger } from "./BaseLogger";

function getColor(type: string) {
    switch (type) {
        case "fatal":
            return kleur.red().inverse;
        case "error":
            return kleur.red;
        case "warn":
            return kleur.yellow;
        case "debug":
            return kleur.magenta;
        case "trace":
            return kleur.gray;
        default:
            return kleur.green;
    }
}
export default class FormattedLogger extends BaseLogger {
    constructor(opts: ILoggerOptions["options"]) {
        super(opts);

        this.opts = _.defaultsDeep(this.opts, {
            colors: true,
            moduleColors: false,
            formatter: "full",
            objectPrinter: null,
            autoPadding: false,
        });

        this.maxPrefixLength = 0;
    }

    init() {
        if (!this.opts.colors) kleur.enabled = false;

        this.objectPrinter = this.opts.objectPrinter
            ? this.opts.objectPrinter
            : (o: any) =>
                  util.inspect(o, {
                      showHidden: false,
                      depth: 5,
                      colors: kleur.enabled,
                      breakLength: Number.POSITIVE_INFINITY,
                  });

        // Generate colorful log level names
        this.levelColorStr = LEVELS.reduce((a: any, level: any) => {
            a[level] = getColor(level)(_.padEnd(level.toUpperCase(), 5));
            return a;
        }, {});

        if (this.opts.colors) {
            this.opts.moduleColors = [
                "yellow",
                "bold.yellow",
                "cyan",
                "bold.cyan",
                "green",
                "bold.green",
                "magenta",
                "bold.magenta",
                "blue",
                "bold.blue",
            ];
        }
    }

    getNextColor(mod: any) {
        if (this.opts.colors && _.isArray(this.opts.moduleColors)) {
            let hash = 0;

            for (let i = 0; i < mod.length; i++) {
                hash = (hash << 5) - hash + mod.charCodeAt(i);
                hash |= 0;
            }
            return this.opts.moduleColors[
                Math.abs(hash) % this.opts.moduleColors.length
            ];
        }

        return "grey";
    }

    padLeft(len: number) {
        if (this.opts.autoPadding)
            return " ".repeat(this.maxPrefixLength - len);
        return "";
    }

    getFormatter(bindings: ILoggerBindings) {
        const formatter = this.opts.formatter;
        const mod = bindings && bindings.mod ? bindings.mod.toUpperCase() : "";
        const c = this.getNextColor(mod);
        const modColorName = c
            .split(".")
            .reduce((a: any, b: any) => a[b] || a()[b], kleur)(mod);
        const moduleColorName = bindings
            ? kleur.grey(bindings.service + "/" + bindings.mod + "/") +
              modColorName
            : "";

        const printArgs = (args: any) => {
            return args.map((p: any) => {
                if (_.isObject(p) || _.isArray(p)) return this.objectPrinter(p);
                return p;
            });
        };

        if (formatter == "json") {
            kleur.enabled = false;
            return (type: string, args: any) => [
                JSON.stringify({
                    ts: Date.now(),
                    level: type,
                    msg: printArgs(args).join(" "),
                    ...bindings,
                }),
            ];
        } else if (formatter == "jsonExt") {
            kleur.enabled = false;
            return (type: string, args: any) => {
                const res = {
                    time: new Date().toISOString(),
                    level: type,
                    message: "",
                    ...bindings,
                };
                if (args.length > 0) {
                    if (typeof args[0] == "object") {
                        Object.assign(res, args[0]);
                        res.message = printArgs(args.slice(1)).join(" ");
                    } else {
                        res.message = printArgs(args).join(" ");
                    }
                }
                return [JSON.stringify(res)];
            };
        } else if (formatter == "simple") {
            return (type: string, args: any) => [
                this.levelColorStr[type],
                "-",
                ...printArgs(args),
            ];
        } else if (formatter == "short") {
            const prefixLen = 23 + bindings.mod.length;
            this.maxPrefixLength = Math.max(prefixLen, this.maxPrefixLength);
            return (type: string, args: any) => [
                kleur.grey(`[${new Date().toISOString().substring(11)}]`),
                this.levelColorStr[type],
                modColorName + this.padLeft(prefixLen) + kleur.grey(":"),
                ...printArgs(args),
            ];
        } else if (formatter == "full") {
            const prefixLen =
                35 + bindings.service.length + bindings.mod.length;
            this.maxPrefixLength = Math.max(prefixLen, this.maxPrefixLength);
            return (type: string, args: any) => [
                kleur.grey(`[${new Date().toISOString()}]`),
                this.levelColorStr[type],
                moduleColorName + this.padLeft(prefixLen) + kleur.grey(":"),
                ...printArgs(args),
            ];
        } else {
            return (type: string, args: any) => {
                const timestamp = new Date().toISOString();
                return [
                    this.render(formatter, {
                        timestamp: kleur.grey(timestamp),
                        level: this.levelColorStr[type],
                        mod: modColorName,
                        msg: printArgs(args).join(" "),
                    }),
                ];
            };
        }
    }

    render(str: string, obj: Record<any, any>) {
        return str.replace(/\{\s?(\w+)\s?\}/g, (match, v) => obj[v] || "");
    }

    getLogHandler(
        _bindings: any,
    ): ((type: TLevelLogger, args: any) => void) | null {
        return null;
    }
}
