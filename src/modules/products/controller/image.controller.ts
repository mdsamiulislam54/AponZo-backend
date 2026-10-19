import status from "http-status";
import { sendResponse } from "../../../utils/apiResponse";
import { catchAsync } from "../../../utils/catchAsync";
import { product_image_service } from "../service/products.image.service";
import { Request, Response } from "express";

const addProductImage = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const productId = req.params.productId as string;
    const file = req.file as Express.Multer.File;
    const product = await product_image_service.addProductImage(userId, productId, file);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Products image add successfully",
        data: product,
    });
});
const deleteProductImage = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const payload = {
        productId: req.params.productId as string,
        imageId: req.params.imageId as string,

    }
    const product = await product_image_service.deleteProductImage(userId, payload);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Products image delete successfully",
        data: product,
    });
});

const replaceProductsImages = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const payload = {
        productId: req.params.productId as string,
        imageId: req.params.imageId as string,
        file: req.file as Express.Multer.File
    }

    const product = await product_image_service.replaceProductsImages(userId, payload);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Products image replace successfully",
        data: product,
    });
});


export const imageController = {
    addProductImage,
    deleteProductImage,
    replaceProductsImages
}