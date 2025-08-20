import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import {
    APP_CONFIG,
    AUTH_CONFIG,
    AWS_CONFIG,
    DATABASE_CONFIG,
    EXTERNAL_CONFIG,
    OAUTH_CONFIG,
} from "./config/app.config";
import { DatabaseModule } from "./config/database/database.module";
import { ModuleWithCommonMiddleware } from "./middlewares";
import { AuthModule } from "./modules/auth.module";
import { UserModule } from "./modules/user.module";
import { GlobalExceptionFilter } from "./shared/common/filters/global-exception.filter";
import { ResponseInterceptor } from "./shared/common/interceptors/response.interceptor";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                APP_CONFIG,
                AUTH_CONFIG,
                OAUTH_CONFIG,
                DATABASE_CONFIG,
                AWS_CONFIG,
                EXTERNAL_CONFIG,
            ],
            envFilePath: [
                `src/config/.env.${process.env.NODE_ENV || "development"}`,
            ],
        }),
        DatabaseModule,
        UserModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule extends ModuleWithCommonMiddleware {}
