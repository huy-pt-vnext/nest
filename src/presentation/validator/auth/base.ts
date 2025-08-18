import { z } from "zod";
import { EMAIL_REGEX } from "../../../shared/constants";

export function validatePasswordStrength(
    password: string,
    ctx: z.RefinementCtx,
    fieldPath: string = "password",
) {
    if (password.length < 6) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 6 characters long",
        });
    } else if (!/[A-Z]/.test(password)) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one uppercase letter",
        });
    } else if (!/[a-z]/.test(password)) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one lowercase letter",
        });
    } else if (!/\d/.test(password)) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one number",
        });
    } else if (!/[!@#%^&*]/.test(password)) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one special character",
        });
    }
}

export function validatePasswordMatch(
    password: string,
    confirmPassword: string,
    ctx: z.RefinementCtx,
    fieldPath: string = "confirmPassword",
) {
    if (password !== confirmPassword) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
        });
    }
}

export function validateEmail(
    email: string,
    ctx: z.RefinementCtx,
    fieldPath: string = "email",
) {
    if (!EMAIL_REGEX.test(email)) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: "Invalid email format",
        });
    }
}
