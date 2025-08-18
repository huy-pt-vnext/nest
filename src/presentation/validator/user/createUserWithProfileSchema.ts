import z from "zod";

export const createUserWithProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    isActive: z.boolean().optional(),
    profileData: z
        .object({
            bio: z.string().optional(),
            avatar: z.string().url("Avatar must be a valid URL").optional(),
        })
        .optional(),
});

export type CreateUserWithProfileInputs = z.infer<
    typeof createUserWithProfileSchema
>;
