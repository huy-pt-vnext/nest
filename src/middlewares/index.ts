import { MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";
import CorsMiddleware from "./CorsMiddleware";
import RequestLoggingMiddleware from "./RequestLoggingMiddleware";

export class ModuleWithCommonMiddleware implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(CorsMiddleware)
            .forRoutes({ path: "*", method: RequestMethod.ALL });

        consumer
            .apply(RequestLoggingMiddleware)
            .forRoutes({ path: "*", method: RequestMethod.ALL });
    }
}
