export class ApiResponse<T = any> {
    public readonly success: boolean;
    public readonly message: string;
    public readonly data?: T;
    public readonly statusCode?: number;

    constructor(
        success: boolean,
        message: string,
        data?: T,
        statusCode?: number,
    ) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    static ok<T>(data?: T, message = "Operation successful"): ApiResponse<T> {
        return new ApiResponse(true, message, data, 200);
    }

    static fail<T>(
        message: string,
        data?: T,
        statusCode = 400,
    ): ApiResponse<T> {
        return new ApiResponse(false, message, data, statusCode);
    }
}
