import { HttpException, HttpStatus } from "@nestjs/common";

export function throwHttpError(statusCode: number, message: string): never {
    throw new HttpException(message, statusCode);
}

export const HttpErrors = {
    badRequest: (message: string = "Bad Request") =>
        throwHttpError(HttpStatus.BAD_REQUEST, message),
    unauthorized: (message: string = "Unauthorized") =>
        throwHttpError(HttpStatus.UNAUTHORIZED, message),
    forbidden: (message: string = "Forbidden") =>
        throwHttpError(HttpStatus.FORBIDDEN, message),
    notFound: (message: string = "Not Found") =>
        throwHttpError(HttpStatus.NOT_FOUND, message),
    conflict: (message: string = "Conflict") =>
        throwHttpError(HttpStatus.CONFLICT, message),
    internalServerError: (message: string = "Internal Server Error") =>
        throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message),
    unprocessableEntity: (message: string = "Unprocessable Entity") =>
        throwHttpError(HttpStatus.UNPROCESSABLE_ENTITY, message),
};

export default HttpErrors;
