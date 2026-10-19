import status from "http-status";
import { IDeleteImage, IReplaceImage } from "../products.validation";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/appErrors";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { deleteFromCloudinary } from "../../../utils/deleteFromCloudinary";

const replaceProductsImages = async (userId: string, payload: IReplaceImage) => {
    const { file, imageId, productId } = payload
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            seller: {
                select: {
                    Store: { select: { id: true } }
                }
            }
        }

    });
    const storeId = user?.seller?.Store?.id;
    if (!storeId) throw new AppError(status.NOT_FOUND, 'Store not found');

    const oldImage = await prisma.productImage.findFirst({
        where: {
            id: imageId,
            productId: productId,
            product: {
                storeId,
                isDeleted: false
            }
        }
    });

    if (!oldImage) throw new AppError(status.NOT_FOUND, 'Image not found');

    const newImage = await uploadToCloudinary(file);

    let uploadedImage;

    try {
        uploadedImage = await prisma.productImage.update({
            where: {
                id: oldImage.id
            },

            data: {
                url: newImage.url,
                publicId: newImage.publicId
            }
        })
    } catch (error) {
        try {
            await deleteFromCloudinary(oldImage.publicId);
        } catch (cleanupError) {
            console.error(
                "Failed to clean up new Cloudinary image:",
                oldImage.publicId,
                cleanupError
            );
        }

        throw error;
    }

    try {
        await deleteFromCloudinary(oldImage.publicId);
    } catch (cleanupError) {
        console.error(
            "Failed to clean up new Cloudinary image:",
            oldImage.publicId,
            cleanupError
        );
    }

    return uploadedImage;





};

const addProductImage = async (userId: string, productId: string, file: Express.Multer.File) => {
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

    const product = await prisma.products.findUnique({
        where: {
            id: productId,
        },
        select: {
            Store: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (product?.Store?.id !== storeId) { throw new AppError(status.FORBIDDEN, "User is not authorized to add image to this product"); };

    if (!file) {
        throw new AppError(status.BAD_REQUEST, "Image is required");
    }

    const uploadImage = await uploadToCloudinary(file);

    try {
        const productImage = await prisma.productImage.create({
            data: {
                productId: productId,
                url: uploadImage.url,
                publicId: uploadImage.publicId,
            }
        })

        return productImage;
    } catch (error) {
        await deleteFromCloudinary(uploadImage.publicId);
        throw error;
    }

}
const deleteProductImage = async (userId: string, payload: IDeleteImage) => {
    const { productId, imageId } = payload;

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

    const product = await prisma.products.findUnique({
        where: {
            id: productId,
            storeId,
        },
        select: {
            id: true,
        }
    });

    if (!product) { throw new AppError(status.FORBIDDEN, "User is not authorized to add image to this product"); };


    const image = await prisma.productImage.findUnique({
        where: {
            id: imageId,
            productId: product?.id
        },
        select: {
            id: true,
            publicId: true,
        },
    });

    if (!image) { throw new AppError(status.FORBIDDEN, "User is not authorized to add image to this product"); };

    await deleteFromCloudinary(image?.publicId);

    await prisma.productImage.delete({
        where: {
            id: image?.id,
        }
    });

    return {
        message: "Product image deleted successfully",
    }

}

export const product_image_service = {
    deleteProductImage,
    replaceProductsImages,
    addProductImage


}