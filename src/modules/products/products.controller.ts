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



export const productsController = {
    createProducts
}