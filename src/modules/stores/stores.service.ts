
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/appErrors";
import { IStoresCreate, IStoresUpdate } from "./stores.validation";

const createStore = async (userId: string, storeData: IStoresCreate) => {
    if (!userId) throw new AppError(status.BAD_REQUEST, "User ID is required to create a store.");
    const sellerId = await prisma.seller.findUnique({
        where: {
            userId
        },
        select: {
            id: true
        }
    });
    if (!sellerId) throw new AppError(status.NOT_FOUND, "Seller not found for the given user ID.");
    const store = await prisma.stores.create({
        data: {
            sellerId: sellerId?.id as string,
            ...storeData,
        }
    })
    if (!store) throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create store.");
    return store;
}

const updateStore = async (storeId: string, storeData: Partial<IStoresUpdate>) => {
    if (!storeId) throw new AppError(status.BAD_REQUEST, "Store ID is required to update a store.");
    const store = await prisma.stores.update({
        where: {
            id: storeId,
        },
        data: {
            ...storeData,
        }
    })
    if (!store) throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to update store.");
    return store;

}

const getStoreById = async (storeId: string) => {
    if (!storeId) throw new AppError(status.BAD_REQUEST, "Store ID is required to fetch a store.");
    const store = await prisma.stores.findUnique({
        where: {
            id: storeId,
            isDeleted: false
        }
    })
    if (!store) throw new AppError(status.NOT_FOUND, "Store not found.");
    return store;
}

const getStoresBySellerId = async (userId: string) => {
    if (!userId) throw new AppError(status.BAD_REQUEST, "User ID is required to fetch stores.");
    const seller = await prisma.seller.findUnique({
        where: {
            userId
        },
        select: {
            id: true
        }
    })

    if (!seller) throw new AppError(status.NOT_FOUND, "Seller not found for the given user ID.");

    const stores = await prisma.stores.findMany({
        where: {
            sellerId: seller?.id,
            isDeleted: false
        }
    })
    if (!stores) throw new AppError(status.NOT_FOUND, "Stores not found.");
    return stores;
}

const deleteStore = async (userId: string) => {
    if (!userId) throw new AppError(status.BAD_REQUEST, "User ID is required to delete a store.");
    const seller = await prisma.seller.findUnique({
        where: {
            userId
        },
        select: {
            id: true
        }
    })

    if (!seller) throw new AppError(status.NOT_FOUND, "Seller not found for the given user ID.");

 
    const store = await prisma.stores.delete({
        where: {
            sellerId: seller.id,
        },
    })
    if (!store) throw new AppError(status.NOT_FOUND, "Store not found or already deleted.");
    return store;
}


export const StoresService = {
    createStore,
    updateStore,
    getStoreById,
    getStoresBySellerId,
    deleteStore
}
