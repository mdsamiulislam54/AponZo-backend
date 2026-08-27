import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/appErrors";
import { ICreateUser, ILoginUser } from "./auth.validation"
import { auth } from "../../lib/auth";
import { getAccessToken, getRefreshToken } from "../../utils/token";

const createUser = async (payload: ICreateUser) => {

    const { email, name, password, role } = payload;
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        throw new AppError(status.BAD_REQUEST, "Already email is taken!")
    }


    const user = await auth.api.signUpEmail({
        body: {
            email,
            name,
            password,
            role: role || "USER"
        }
    });



    try {
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



        console.log("user", refreshToken, accessToken, user)
        return {
            accessToken,
            refreshToken,
            ...user,

        }
    } catch (error) {
        await prisma.user.delete({
            where: {
                id: user.user.id,
            },
        });

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