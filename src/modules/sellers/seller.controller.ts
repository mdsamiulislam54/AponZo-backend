
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sellerService } from "./sellers.service";
import { sendResponse } from "../../utils/apiResponse";
import status from "http-status";


const getSellerProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log(userId)
    if (!userId) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            status: status.BAD_REQUEST,
            message: "User id is required"
        })
    }

    const sellerProfile = await sellerService.getSellerProfile(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller profile fetched successfully",
        data: sellerProfile,
    });
})

const sellerProfileUpdate = catchAsync(async (req: Request, res: Response) => {
    const id = req.user?.id as string
    console.log("User ID for profile update:", id,req.body);
    const sellerProfile = await sellerService.sellerProfileUpdate(req.body,id);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller profile updated successfully",
        data: sellerProfile,
    });
})

const createSellerAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            status: status.BAD_REQUEST,
            message: "User id is required"
        })
    }

    const sellerAddress = await sellerService.createSellerAddress(userId, req.body);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller address created successfully",
        data: sellerAddress,
    });
})

const updateSellerAddress = catchAsync(async (req: Request, res: Response) => {
    const addressId = req.params?.id as string;
  
    const sellerAddress = await sellerService.updateSellerAddress(addressId, req.body);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller address updated successfully",
        data: sellerAddress,
    });
})

const getSellerAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {

        return res.status(status.BAD_REQUEST).json({
            success: false,
            status: status.BAD_REQUEST,
            message: "User id is required"
        })
    }

    const sellerAddress = await sellerService.getSellerAddress(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller address fetched successfully",
        data: sellerAddress,
    })
})

const deleteSellerAddress = catchAsync(async (req: Request, res: Response) => {
    const addressId = req.params?.id as string;
  
    const sellerAddress = await sellerService.deleteSellerAddress(addressId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller address deleted successfully",
        data: sellerAddress,
    })
})

const createSellerDocument = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            status: status.BAD_REQUEST,
            message: "User id is required"
        })
    }

    const sellerDocument = await sellerService.createSellerDocument(userId, req.body);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller document created successfully",
        data: sellerDocument,
    })
})

const getSellerDocument = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            status: status.BAD_REQUEST,
            message: "User id is required"
        })
    }

    const sellerDocument = await sellerService.getSellerDocument(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller document fetched successfully",
        data: sellerDocument,
    })
})

const updateSellerDocument = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params?.id as string;
    if (!userId) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            status: status.BAD_REQUEST,
            message: "User id is required"
        })
    }
    const sellerDocument = await sellerService.updateSellerDocument(userId, req.body);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller document updated successfully",
        data: sellerDocument,
    })
})

const deleteSellerDocument = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params?.id as string;
    if (!userId) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            status: status.BAD_REQUEST,
            message: "User id is required"
        })
    }
    const sellerDocument = await sellerService.deleteSellerDocument(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Seller document deleted successfully",
        data: sellerDocument,
    })

})


export const sellerController = {
    getSellerProfile,
    sellerProfileUpdate,
    createSellerAddress,
    updateSellerAddress,
    getSellerAddress,
    deleteSellerAddress,
    createSellerDocument,
    getSellerDocument,
    updateSellerDocument,
    deleteSellerDocument
}

