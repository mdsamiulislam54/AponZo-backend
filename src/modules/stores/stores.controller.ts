import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/apiResponse";
import status from "http-status";
import { StoresService } from "./stores.service";


const createStore = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const storeData = req.body;
    const store = await StoresService.createStore(userId, storeData);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Store created successfully",
        data: store,
    });
})

const updateStore = catchAsync(async (req: Request, res: Response) => {
    const storeId = req.params.id as string;
    const storeData = req.body;
    const store = await StoresService.updateStore(storeId, storeData);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Store updated successfully",
        data: store,
    });
});

const getStoreById = catchAsync(async (req: Request, res: Response) => {
    const storeId = req.params.id as string;
    const store = await StoresService.getStoreById(storeId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Store fetched successfully",
        data: store,
    });
})

const getStoresBySellerId = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const stores = await StoresService.getStoresBySellerId(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Stores fetched successfully",
        data: stores,
    });
})

const deleteStore = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const store = await StoresService.deleteStore(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Store deleted successfully",
        data: store,
    });
})

export const StoresController = {
    createStore,
    getStoreById,
    getStoresBySellerId,
    updateStore,
    deleteStore,
}