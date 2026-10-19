import status from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/appErrors";


const deleteSpecificationById = async (userId: string, id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            seller: {
                select: {
                    Store: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });
    const storeId = user?.seller?.Store?.id;

    if (!storeId) { throw new AppError(status.FORBIDDEN, "User is not a seller or does not have a store"); }
    await prisma.products_Specification.deleteMany({
        where: {
            id,
            Product: {
                storeId: storeId,
            }
        }
    })
    return { message: "Product specification deleted successfully", };
}




export const specificationService = {
    deleteSpecificationById
}