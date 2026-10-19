import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/appErrors";
import {  IDeleteImage, IProductCreate, IProductUpdate, IReplaceImage } from "./products.validation";
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
            ProductImages: true,
            Products_Specification: true,
            Products_Variant: true

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

const updateProductById = async (userId: string, productId: string, data: Partial<IProductUpdate>) => {
    const { specifications, variants, categoryId, ...productData } = data;
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


    return prisma.$transaction(async (tx) => {
        const existingProduct = await tx.products.findFirst({
            where: {
                id: productId,
                storeId,
            },
            select: { id: true },
        });

        if (!existingProduct) { throw new AppError(status.NOT_FOUND, "Product not found") };

        const updatedProduct = await tx.products.update({
            where: {
                id: existingProduct?.id,
            },
            data: {
                ...productData
            },
        });

        if (specifications !== undefined) {
            for (const spec of specifications) {
                if (spec.id) {
                    const result = await tx.products_Specification.updateMany({
                        where: {
                            id: spec.id,
                            productId
                        },
                        data: {
                            key: spec.key,
                            value: spec.value,
                        },
                    });
                    if (result.count !== 1) {
                        throw new AppError(status.NOT_FOUND, "Product specification not found")
                    }
                } else {
                    await tx.products_Specification.create({
                        data: {
                            key: spec.key!,
                            value: spec.value!,
                            productId: existingProduct?.id
                        },
                    });


                }


            }
        }

        if (variants !== undefined) {
            for (const variant of variants) {
                if (variant.id) {
                    const result = await tx.products_Variant.updateMany({
                        where: {
                            id: variant.id,
                            productId: existingProduct?.id,
                        },
                        data: {
                            sku: variant.sku,
                            color: variant.color,
                            size: variant.size,
                            price: variant.price,
                            stock: variant.stock,

                        },
                    });
                    if (result.count !== 1) {
                        throw new AppError(status.BAD_REQUEST, 'Variant already exists')
                    }

                } else {
                    await tx.products_Variant.create({
                        data: {
                            price: variant.price!,
                            sku: variant.sku!,
                            color: variant.color,
                            size: variant.size,
                            stock: variant.stock!,
                            productId: existingProduct?.id,
                        },
                    });


                }
            }
        }

        return updatedProduct;
    })

}

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
    deleteProductById,
    updateProductById,
    deleteSpecificationById,
    deleteProductVariantById,
    addProductImage,
    deleteProductImage

}