import status from "http-status";
import { sendResponse } from "../../utils/apiResponse";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { productService } from "./products.service";
const createProducts = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const files = req.files as Express.Multer.File[];
    const uploadedImages = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
    )


    const payload = {
        ...req.body,
        uploadedImages
    }

    const product = await productService.createProduct(userId, payload);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Products created successfully",
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

    const product = await productService.replaceProductsImages(userId, payload);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Products image replace successfully",
        data: product,
    });
});
const getAllProducts = catchAsync(async (req: Request, res: Response) => {

    const product = await productService.getAllProducts();
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Products retrieved successfully",
        data: product,
    });
});
const deleteProductById = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const product = await productService.deleteProductById(productId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Products Delete successfully",
        data: product,
    });
});




export const productsController = {
    createProducts,
    replaceProductsImages,
    getAllProducts,
    deleteProductById
}