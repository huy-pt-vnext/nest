import { LEVELS, TYPES } from "../constants/logger.constant";

export type TFormatLogger = "simple" | "full" | "json" | "jsonExt" | "short";

export type TLevelLogger = (typeof LEVELS)[number];
export type TTypeLogger = (typeof TYPES)[number];

export interface ILoggerOptions {
    type: TTypeLogger;
    options: {
        formatter: TFormatLogger;
        level: TLevelLogger | Record<string, TLevelLogger>;
        createLogger?: any;
        colors?: boolean;
        objectPrinter?: (...args: any) => string;
        moduleColors?: string[];
        autoPadding?: boolean;
        pino?: {
            options?: any;
            destination?: any;
        };
    };
}

export type TLogger = Record<TLevelLogger, (...args: any) => any>;

export interface ILoggerBindings {
    mod: string;
    service: string;
    env: string;
}
