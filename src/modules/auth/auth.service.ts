
import { prisma } from "../../lib/prisma";
import { ICreateUser, ILoginUser, SignUpResponse, } from "./auth.validation"
import { auth } from "../../lib/auth";
import { generateToken} from "../../utils/token";
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

export const authService = {
    createUser,
    loginUser,
}