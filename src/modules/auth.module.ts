import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import AuthController from "../controllers/auth.controller";
import AuthenticationGuard from "../guards/AuthenticationGuard";
import PermissionsGuard from "../guards/PermissionsGuard";
import UserRepositoryImpl from "../repositories/impl/UserRepositoryImpl";
import AuthService from "../services/AuthService";
import { TransactionService } from "../services/TransactionService";
import { REPOSITORY_TOKENS } from "../shared/constants";
import JwtHelper from "../shared/helper/jwt.helper";

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        TransactionService,
        JwtHelper,
        {
            provide: REPOSITORY_TOKENS.USER_REPOSITORY,
            useClass: UserRepositoryImpl,
        },

        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        },
    ],
})
export class AuthModule {}
