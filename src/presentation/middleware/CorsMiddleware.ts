import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export default class CorsMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        );
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        );
        res.header("Access-Control-Allow-Credentials", "true");

        if (req.method === "OPTIONS") {
            res.status(200).send();
            return;
        }

        next();
    }
}
