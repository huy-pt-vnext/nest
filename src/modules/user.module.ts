import { Module } from "@nestjs/common";
import UserController from "../controllers/user.controller";
import UserRepositoryImpl from "../repositories/impl/UserRepositoryImpl";
import UserService from "../services/UserService";
import { REPOSITORY_TOKENS } from "../shared/constants";

@Module({
    controllers: [UserController],
    providers: [
        UserService,

        {
            provide: REPOSITORY_TOKENS.USER_REPOSITORY,
            useClass: UserRepositoryImpl,
        },
    ],
})
export class UserModule {}
