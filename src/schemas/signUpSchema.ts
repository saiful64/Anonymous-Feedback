import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be at least 4 characters long")
  .max(20, "Username must be at most 20 characters long")
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Username must contain only letters, numbers, and underscores"
  );

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
