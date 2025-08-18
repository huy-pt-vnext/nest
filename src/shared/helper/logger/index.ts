import * as dotenv from "dotenv";
import { resolve } from "./base";
import LoggerFactory from "./LoggerFactory";
dotenv.config({
    path: `src/infrastructure/config/.env.${process.env.NODE_ENV || "development"}`,
});

export const loggerFactory = new LoggerFactory();
const consoleLogger = resolve({
    type: "Console",
    options: {
        formatter: "simple",
        level: "trace",
    },
});

const pinoLogger = resolve({
    type: "Pino",
    options: {
        level: {
            GLOBAL: "info",
        },
        formatter: "json",
    },
});

const loggers =
    process.env.NODE_ENV === "production"
        ? [pinoLogger]
        : [consoleLogger, pinoLogger];

loggerFactory.init(loggers);

export const logger = loggerFactory.getLogger({
    service: "backend",
    mod: "GLOBAL",
    env: process.env.NODE_ENV || "development",
});
