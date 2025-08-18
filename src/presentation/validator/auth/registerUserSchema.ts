import { z } from "zod";
import { ZodValidationPipe } from "../zod-validation.pipe";
import {
    validateEmail,
    validatePasswordMatch,
    validatePasswordStrength,
} from "./base";

const registerUserSchema = z
    .object({
        name: z.string().min(3, "Name is required"),
        email: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
        const { email, password, confirmPassword } = data;

        // validate email format
        validateEmail(email, ctx);

        // validate password strength
        validatePasswordStrength(password, ctx);

        // validate password match
        validatePasswordMatch(password, confirmPassword, ctx);
    });

export const registerUserValidationPipe = new ZodValidationPipe(
    registerUserSchema,
);

export type RegisterUserInputs = z.infer<typeof registerUserSchema>;
