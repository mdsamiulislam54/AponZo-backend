
import { prisma } from "../../lib/prisma";
import { ICreateUser, IForgotPassword, ILoginUser, IResetPassword, SignUpResponse, } from "./auth.validation"
import { auth } from "../../lib/auth";
import { generateToken } from "../../utils/token";
import { USER_ROLE } from "../../constants/user.constants";
import envConfig from "../../config/env";

const createUser = async (payload: ICreateUser) => {
    const { email, name, password, role, businessName, businessType } = payload;
    let user: SignUpResponse | undefined;
    try {
        user = await auth.api.signUpEmail({
            body: {
                email,
                name,
                password,
                role: role || USER_ROLE.USER
            }
        });
        await prisma.$transaction(async (tx) => {

            if (role === USER_ROLE.SELLER && user) {
                await tx.seller.create({
                    data: {
                        userId: user.user.id,
                        businessName: businessName ?? "Business Name",
                        businessType: businessType ?? "INDIVIDUAL",

                    }
                })
            }
        })

        const tokenPayload = {
            userId: user.user.id,
            email: user.user.email,
            name: user.user.name,
            role: user.user.role
        }

        const token = generateToken(tokenPayload)

        return {
            ...token,
            ...user
        };

    } catch (error) {
        console.error("Create user error:", error);
        if (user?.user?.id) {
            await prisma.user.delete({
                where: {
                    id: user.user.id
                },
            }).catch((rollbackError) => {
                console.error("Failed to rollback user:", rollbackError);
            })
        }

        throw error;
    }
}

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload

    const user = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    })

    const tokenPayload = {
        userId: user.user.id,
        email: user.user.email,
        name: user.user.name,
        role: user.user.role
    }

    const token = generateToken(tokenPayload)

    return {
        ...token,
        ...user,
    }

}

const resetPassword = async (payload: IResetPassword) => {
    const { newPassword, token } = payload

    await auth.api.resetPassword({
        body: {
            newPassword,
            token
        }
    })

    return {
        message: "Password reset successfully"
    }

}

const forgotPassword = async (payload: IForgotPassword) => {
    await auth.api.requestPasswordReset({
        body: {
            email: payload.email,
            redirectTo: `${envConfig.frontend_url}/reset-password`
        }
    })

    return {
        message:"If an account exists with this email, a password reset link has been sent.",
    };
}

export const authService = {
    createUser,
    loginUser,
    resetPassword,
    forgotPassword
}