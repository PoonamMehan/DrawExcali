import { Request } from "express";
import { Secret } from "jsonwebtoken";
import { z } from "zod";

export interface UserReq extends Request {
    userId?: string
}

const tokenSecretSchema = z.custom<Secret>((val)=>val.length > 0)
const envSchema = z.object({
    ACCESS_TOKEN_SECRET: tokenSecretSchema
})

export const parsedEnvVars = envSchema.safeParse(process.env);

export const SignupSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(6).max(100)
})
export const LoginSchema = z.object({
    email: z.string().email(),
    username: z.string().optional(),
    password: z.string().min(6).max(100)
})