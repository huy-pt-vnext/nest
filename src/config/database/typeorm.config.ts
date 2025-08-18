import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "../../entities/user.entity";

export const createTypeOrmConfig = (
    configService: ConfigService,
): DataSourceOptions => {
    return {
        type: "postgres",
        host: configService.get<string>("database.DATABASE_HOST"),
        port: configService.get<number>("database.DATABASE_PORT"),
        username: configService.get<string>("database.DATABASE_USER"),
        password: configService.get<string>("database.DATABASE_PASSWORD"),
        database: configService.get<string>("database.DATABASE_NAME"),
        url: configService.get<string>("database.DATABASE_URL"),
        entities: [User],
        migrations: ["dist/src/infrastructure/database/migrations/*.js"],
        synchronize: configService.get<string>("app.nodeEnv") === "development",
        logging: configService.get<string>("app.nodeEnv") === "development",
        ssl:
            configService.get<string>("app.nodeEnv") === "production"
                ? { rejectUnauthorized: false }
                : false,
    };
};

export const createDataSource = (configService: ConfigService): DataSource => {
    return new DataSource(createTypeOrmConfig(configService));
};
