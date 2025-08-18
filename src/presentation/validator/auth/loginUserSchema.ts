import { z } from "zod";
import { ZodValidationPipe } from "../zod-validation.pipe";
import { validateEmail, validatePasswordStrength } from "./base";

const loginUserSchema = z
    .object({
        email: z.string(),
        password: z.string(),
    })
    .superRefine((data, ctx) => {
        const { email, password } = data;

        // validate email format
        validateEmail(email, ctx);

        // validate password strength
        validatePasswordStrength(password, ctx);
    });

export const loginUserValidationPipe = new ZodValidationPipe(loginUserSchema);

export type LoginUserInputs = z.infer<typeof loginUserSchema>;
