
import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name is required"),

        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),

        password: z
            .string()
            .min(6, "Password must contain at least 6 characters"),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});

export const activationSchema = z.object({
    activation_token: z
        .string()
        .trim()
        .min(1, "Activation token is required"),

    activation_code: z
        .string()
        .trim()
        .min(1, "Activation code is required")
        .regex(/^\d+$/, "Activation code must contain only numbers"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, "Password must contain at least 6 characters"),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
