import { Request } from "express";
import { Secret } from "jsonwebtoken";
import { z } from "zod";

export interface UserReq extends Request {
    userId?: string
}

const tokenSecretSchema = z.custom<Secret>((val)=>val?.length > 0)
const envSchema = z.object({
    ACCESS_TOKEN_SECRET: tokenSecretSchema
})

export const parsedEnvVars = envSchema.safeParse(process.env);

export interface UserSignup {
    email: String,
    username: String,
    password: String
}

export const SignupSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    username: z.string().optional(),
    password: z.string().min(6, "Password must be atleast 6 characters long.").max(100, "password cannot be logner than 100 characters.")
})
export const LoginSchema = z.object({
    email: z.string().email("Please enter a valid email.").optional(),
    username: z.string().optional(),
    password: z.string().min(6,"Password must be atleast 6 characters long.").max(100, "Password cannot be logner than 100 characters.")
})

export const CreateRoomSchema = z.object({
    name: z.string()
})