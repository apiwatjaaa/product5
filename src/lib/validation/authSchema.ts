import { z } from "zod";

const emailField = z.email({ message: "invalidEmail" });
const passwordField = z.string().min(6, { message: "passwordTooShort" });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "invalidCredentials" }),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: emailField,
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordMismatch",
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: passwordField,
});
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
