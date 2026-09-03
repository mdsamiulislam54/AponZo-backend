import { prisma } from "../../lib/prisma";
import { sellerAddressType, sellerAddressUpdateType, sellerDocumentType, sellerDocumentUpdateType } from "./seller.zod.validation";
import {  ISellerProfileUpdate } from "./sellers.validation";

const getSellerProfile = async (userId: string) => {
    return await prisma.seller.findUnique({
        where: {
            userId
        },

        include: {
            SellerAddress: {
                select: {
                    address: true,
                    city: true,
                    country: true,
                    district: true,
                    isDefault: true,
                    id: true,
                    name: true,
                    phone: true,
                    type: true,
                    zipCode: true

                }
            },
            SellerDocument: {
                select: {
                    id: true,
                    documentType: true,
                    documentUrl: true,
                    rejectionReason: true,
                    status: true,
                    reviewedBy: true,
                    reviewedAt: true,

                }
            }

        }
    });
};

const sellerProfileUpdate = async (payload: Partial<ISellerProfileUpdate>, id: string) => {
   return await prisma.seller.update({
        where: {
            userId: id
        },
        data: {...payload}
    });

};

const createSellerAddress = async (userId: string, payload: sellerAddressType) => {
    const address = await prisma.sellerAddress.create({
        data: {
            ...payload,
            sellerId: userId
        }
    });
    return address;
}

const updateSellerAddress = async (addressId: string, payload: Partial<sellerAddressUpdateType>) => {
    const address = await prisma.sellerAddress.update({
        where: {
            id: addressId
        },
        data: {
            ...payload
        }
    });
    return address;
}

const deleteSellerAddress = async (addressId: string) => {
    const address = await prisma.sellerAddress.delete({
        where: {
            id: addressId
        }
    });
    return address;
}


const getSellerAddress = async (userId: string) => {
    const address = await prisma.sellerAddress.findMany({
        where: {
            sellerId: userId
        }
    });
    return address;
}

const createSellerDocument = async (userId: string, payload: sellerDocumentType) => {
    const document = await prisma.sellerDocument.create({
        data: {
            ...payload,
            sellerId: userId
        }
    });
    return document;
}

const getSellerDocument = async (userId: string) => {
    const document = await prisma.sellerDocument.findMany({
        where: {
            sellerId: userId
        }
    });
    return document;
}
const updateSellerDocument = async (documentId: string, payload: sellerDocumentUpdateType) => {
    const document = await prisma.sellerDocument.update({
        where: {
            id: documentId
        },
        data: {
            ...payload
        }
    });
    return document;
}

const deleteSellerDocument = async (documentId: string) => {
    const document = await prisma.sellerDocument.delete({
        where: {
            id: documentId
        }
    });
    return document;
}


export const sellerService = {
    getSellerProfile,
    sellerProfileUpdate,
    createSellerAddress,
    getSellerAddress,
    updateSellerAddress,
    deleteSellerAddress,
    createSellerDocument,
    getSellerDocument,
    updateSellerDocument,
    deleteSellerDocument
}