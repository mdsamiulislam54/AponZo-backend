import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/appErrors";
import { ICreateUser } from "./auth.validation"
import { auth } from "../../lib/auth";

const createUser = async (payload: ICreateUser) => {
    console.log(payload)
    const { email, name, password } = payload;
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
            password
        }
    })

    return user


}

export const authService = {
    createUser
}