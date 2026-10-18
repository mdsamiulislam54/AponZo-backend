import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/appErrors";
import { IProductCreate, IReplaceImage } from "./products.validation";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";

const createProduct = async (userId: string, product: IProductCreate) => {
    const { name, description, categoryId, basePrice, features, isShippingFree, slug, shippingFee, discountPrice, tags, brand, isFeatured,
        specifications, variants, uploadedImages
    } = product;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            seller: {
                select: {
                    Store: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });
    const storeId = user?.seller?.Store?.id;
    if (!storeId) {
        throw new AppError(status.FORBIDDEN, "User is not a seller or does not have a store");
    }

    return await prisma.$transaction(async (tx) => {
        const createdProduct = await tx.products.create({
            data: {
                name,
                description,
                categoryId,
                basePrice,
                features,
                isShippingFree,
                slug,
                shippingFee,
                discountPrice,
                tags,
                brand,
                isFeatured,
                storeId: storeId,
            }
        });

        if (specifications && specifications.length > 0) {

            await tx.products_Specification.createMany({
                data: specifications.map(spec => ({
                    productId: createdProduct.id,
                    key: spec.key.trim(),
                    value: spec.value.trim()
                }))
            })
        }

        if (variants && variants.length > 0) {
            await tx.products_Variant.createMany({
                data: variants.map(variant => ({
                    productId: createdProduct.id,
                    sku: variant.sku.trim(),
                    color: variant.color,
                    size: variant.size,
                    price: variant.price,
                    stock: variant.stock
                }))
            })
        }

        if (uploadedImages && uploadedImages.length > 0) {

            await tx.productImage.createMany({
                data: uploadedImages.map((image: { url: string; publicId: string }) => ({
                    productId: createdProduct.id,
                    url: image.url,
                    publicId: image.publicId
                }))
            })
        }

        const [productSpecifications, productVariants, productImages] = await Promise.all([
            tx.products_Specification.findMany({
                where: {
                    productId: createdProduct.id
                }
            }),
            tx.products_Variant.findMany({
                where: {
                    productId: createdProduct.id
                }
            }),
            tx.productImage.findMany({
                where: {
                    productId: createdProduct.id
                }
            }),
        ])

        return {
            product: createdProduct,
            specifications: productSpecifications,
            variants: productVariants,
            images: productImages
        };




    },

        {
            maxWait: 10000,
            timeout: 5000,
        }

    );
}
const getAllProducts = async () => {
    return await prisma.products.findMany({
        where: {
            isDeleted: false
        },
        include: {
            ProductImages: true

        }

    })
}
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







}


const deleteProductById = async (id: string) => {
    const product = await prisma.products.delete({
        where: {
            id
        }
    })
    return product
}



export const productService = {
    createProduct,
    getAllProducts,
    replaceProductsImages,
    deleteProductById

}