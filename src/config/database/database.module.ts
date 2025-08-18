import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { createTypeOrmConfig } from "./typeorm.config";

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                createTypeOrmConfig(configService),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
