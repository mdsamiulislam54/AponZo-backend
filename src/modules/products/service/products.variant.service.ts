import status from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/appErrors";

const deleteProductVariantById = async (userId: string, id: string) => {
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
    await prisma.products_Variant.deleteMany({
        where: {
            id,
            Product: {
                storeId: storeId,
            }
        }
    })
    return { message: "Product Variant deleted successfully", };
}

export const ProductsVariantService = {
    deleteProductVariantById,
    
}
