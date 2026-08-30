import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import envConfig from "../config/env";
import { sendEmail } from "../service/sendEmail";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",

    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        maxPasswordLength: 8,
        resetPasswordTokenExpiresIn: 60 * 60,
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset Password",
                templateName: "resetPassword",
                templateData: {
                    url,
                    user
                }

            })

        },
        onPasswordReset: async ({ user }) => {
            console.log(`Password reset successful: ${user.email}`);
        },

    },
    trustedOrigins: [envConfig.auth_url!, envConfig.frontend_url!],
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
    },



});