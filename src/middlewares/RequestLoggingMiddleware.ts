import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export default class RequestLoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RequestLoggingMiddleware.name);

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get("User-Agent") || "";
        const startTime = Date.now();

        this.logger.log(`[${method}] ${originalUrl} - ${ip} - ${userAgent}`);

        const originalEnd = res.end.bind(res);

        res.end = (
            chunk?: any,
            encoding?: BufferEncoding | (() => void),
            cb?: () => void,
        ): Response => {
            const responseTime = Date.now() - startTime;
            const contentLength = res.get("content-length") || "0";

            this.logger.log(
                `[${method}] ${originalUrl} - ${res.statusCode} - ${contentLength}bytes - ${responseTime}ms`,
            );

            if (typeof encoding === "function") {
                return originalEnd(chunk, encoding);
            }
            return originalEnd(chunk, encoding, cb);
        };

        next();
    }
}
``;
