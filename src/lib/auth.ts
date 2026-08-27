import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import envConfig from "../config/env";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",

    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        maxPasswordLength: 8

    },
    trustedOrigins: [envConfig.auth_url!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                default: "user"
            },
          
            // phone: {
            //     type: "string",
            //     required: true,
            // },
            // address: {
            //     type: "string",
            //     required: true,
            // }
        }
    }
});