import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../api-response";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === "string") {
                message = exceptionResponse;
            } else {
                message =
                    (exceptionResponse as { message?: string }).message ||
                    exception.message;
            }
        }

        this.logger.error(
            `HTTP Status: ${status} Error Message: ${message}`,
            exception instanceof Error
                ? exception.stack
                : "No stack trace available",
        );

        const errorResponse = ApiResponse.fail(message);

        response.status(status).json(errorResponse);
    }
}
