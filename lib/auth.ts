import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
//import { PrismaClient } from "@/generated/prisma";
 import {prisma} from "./singletonPrismaClient"
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    session:{
        expiresIn:7*24*60*60
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {  
        enabled: true,
        minPasswordLength:5,
        maxPasswordLength:25
    },
    socialProviders: { 
        github: { 
           clientId: process.env.GITHUB_CLIENT_ID as string, 
           clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        },
        google:{
            prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        } 
    },
    plugins:[nextCookies()] 
});

 
