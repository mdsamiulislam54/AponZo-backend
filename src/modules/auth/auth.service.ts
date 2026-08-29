import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/appErrors";
import { ICreateUser, ILoginUser, SignUpResponse, } from "./auth.validation"
import { auth } from "../../lib/auth";
import { getAccessToken, getRefreshToken } from "../../utils/token";
import { USER_ROLE } from "../../constants/user.constants";

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

            if (role === USER_ROLE.SELLER) {
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

        const accessToken = getAccessToken(tokenPayload);
        const refreshToken = getRefreshToken(tokenPayload);

        return {
            accessToken,
            refreshToken,
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

        throw new AppError(status.INTERNAL_SERVER_ERROR, "Something went wrong!");

    }
}

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },

    });

    if (!existingUser) {
        throw new AppError(status.NOT_FOUND, "User not found!");
    }

    const user = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    })
    if (!user) {
        throw new AppError(status.NOT_FOUND, "Login failed!");
    }
    const accessToken = getAccessToken({
        userId: user.user.id,
        email: user.user.email,
        name: user.user.name,
        role: user.user.role
    });

    const refreshToken = getRefreshToken({
        userId: user.user.id,
        email: user.user.email,
        name: user.user.name,
        role: user.user.role
    });

    return {
        accessToken,
        refreshToken,
        ...user,
    }

}

export const authService = {
    createUser,
    loginUser,
}