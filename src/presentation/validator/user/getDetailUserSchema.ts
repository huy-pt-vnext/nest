import z from "zod";

export const getDetailUserSchema = z.string().uuid("Invalid user ID format");

export type GetDetailUserInputs = z.infer<typeof getDetailUserSchema>;
