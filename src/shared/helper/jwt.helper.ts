import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "../../config/app.config";

@Injectable()
export default class JwtHelper {
    constructor(
        @Inject(AUTH_CONFIG.KEY)
        private authConfig: ConfigType<typeof AUTH_CONFIG>,
    ) {}
    builder(userId: string, key: Buffer, expired: string) {
        const payload = {
            userId,
        };
        return jwt.sign(payload, key, {
            algorithm: "HS256",
            expiresIn: expired as any,
        });
    }

    getAccessKey() {
        return Buffer.from(
            this.authConfig.ACCESS_SECRET_KEY as string,
            "base64",
        );
    }

    getRefreshKey() {
        return Buffer.from(
            this.authConfig.REFRESH_SECRET_KEY as string,
            "base64",
        );
    }

    public generateAccessToken(userId: string): string {
        return this.builder(
            userId,
            this.getAccessKey(),
            this.authConfig.ACCESS_EXPIRATION as string,
        );
    }

    public generateRefreshToken(userId: string): string {
        return this.builder(
            userId,
            this.getRefreshKey(),
            this.authConfig.REFRESH_EXPIRATION as string,
        );
    }

    public async verifyAccessToken(token: string): Promise<Record<any, any>> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.getAccessKey(), (err, decoded: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    public async verifyRefreshToken(token: string): Promise<Record<any, any>> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.getRefreshKey(), (err, decoded: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
