import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/appErrors";
import { CategoryInput } from "./category.validation";

const createCategory = async (category: CategoryInput) => {
    return await prisma.category.create({
        data: { ...category }
    })
}

const getCategoryWithParentAndChildren = async () => {
    return await prisma.category.findMany({
        where: {
            parentId: null,
            isDeleted: false,
        },
        include: {
            parent: true,
            children: {
                where: {
                    isDeleted: false,
                },
                include: {
                    children: {
                        where: {
                            isDeleted: false,
                        }
                    }
                }
            }
        }
    })

}

const getCategoryWithParent = async () => {
    return await prisma.category.findMany({
        where: {
            parent: null,
            isDeleted: false
        },
        include: {
            parent: true
        }
    })
}

const getCategoryWithChildren = async () => {
    return await prisma.category.findMany({
        where: {
            parentId: {not : null},
            isDeleted: false
        },
      
    })
}

const updateCategory = async (id: string, category: CategoryInput) => {
    return await prisma.category.update({
        where: { id },
        data: { ...category }
    })
}

const deleteCategory = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },
        include: {
            children: {
                where: {
                    isDeleted: false
                }
            },
        },
    });

    if (!category || category.isDeleted) {
        throw new AppError(status.NOT_FOUND, "Category not found");
    }

    if (category.children.length > 0) {
        throw new AppError(status.BAD_REQUEST, "Cannot delete category. Please move or delete its subcategories first.");
    }

    // const productCount = await prisma.product.count({
    //     where: {
    //         categoryId: id,
    //         isDeleted: false,
    //     },
    // });

    // if (productCount > 0) {
    //     throw new AppError(
    //         status.BAD_REQUEST,
    //         "Cannot delete category because it contains products."
    //     );
    // }

    return await prisma.category.update({
        where: { id },
        data: {
            isDeleted: true
        }
    })
}



export const categoryService = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryWithParentAndChildren,
    getCategoryWithParent,
    getCategoryWithChildren

}