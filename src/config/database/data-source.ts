import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../../entities/user.entity";

dotenv.config({
    path: `src/config/.env.${process.env.NODE_ENV || "development"}`,
});

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "pass",
    database: process.env.DATABASE_NAME || "postgres",
    url: process.env.DATABASE_URL,
    entities: [User],
    migrations: ["src/config/database/migrations/*.ts"],
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
    ssl: false,
});

export default AppDataSource;
