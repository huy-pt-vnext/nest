// API Response Messages
export const API_MESSAGES = {
    USER: {
        CREATED: "User created successfully",
        PROFILE_CREATED: "User with profile created successfully",
        RETRIEVED: "User retrieved successfully",
        USERS_RETRIEVED: "Users retrieved successfully",
        UPDATED: "User updated successfully",
        DELETED: "User deleted successfully",
        NOT_FOUND: "User not found",
        EMAIL_EXISTS: "User with this email already exists",
    },
    GENERAL: {
        SUCCESS: "Operation successful",
        FAILURE: "Operation failed",
        VALIDATION_ERROR: "Validation failed",
        UNAUTHORIZED: "Unauthorized access",
        FORBIDDEN: "Access forbidden",
    },
} as const;

// Repository Tokens
export const REPOSITORY_TOKENS = {
    USER_REPOSITORY: "USER_REPOSITORY",
} as const;

// Service Tokens
export const SERVICE_TOKENS = {
    JSON_WEB_TOKEN: "JSON_WEB_TOKEN",
} as const;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
