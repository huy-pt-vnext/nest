import { registerAs } from "@nestjs/config";

export const APP_CONFIG = registerAs("app", () => ({
    PORT: parseInt(process.env.PORT || "3000", 10),
    NODE_ENV: process.env.NODE_ENV || "development",
}));

export const AUTH_CONFIG = registerAs("auth", () => ({
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
    ACCESS_EXPIRATION: process.env.ACCESS_EXPIRATION,
    REFRESH_EXPIRATION: process.env.REFRESH_EXPIRATION,
}));

export const OAUTH_CONFIG = registerAs("oauth", () => ({
    GOOGLE: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
        GOOGLE_CLIENT_REDIRECT_URL_CALLBACK:
            process.env.GOOGLE_CLIENT_REDIRECT_URL_CALLBACK,
    },
    GITHUB: {
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
    },
}));

export const DATABASE_CONFIG = registerAs("database", () => ({
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: parseInt(process.env.DATABASE_PORT || "5432", 10),
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
}));

export const AWS_CONFIG = registerAs("aws", () => ({
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "test",
    AWS_S3_BUCKET_PRIVATE: process.env.AWS_S3_BUCKET_PRIVATE || "test-private",
}));

export const EXTERNAL_CONFIG = registerAs("external", () => ({
    frontendUrl: process.env.FRONTEND_URL,
    sendGridApiKey: process.env.SEND_GRID_API_KEY || "",
}));
