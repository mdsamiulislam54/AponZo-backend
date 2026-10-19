import status from "http-status";
import { sendResponse } from "../../../utils/apiResponse";
import { catchAsync } from "../../../utils/catchAsync";

import { Request, Response } from "express";
import { ProductsVariantService } from "../service/products.variant.service";
const deleteProductVariantById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const variantById = req.params.id as string;
    const product = await ProductsVariantService.deleteProductVariantById(userId, variantById);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Variant  delete successfully",
        data: product,
    });
});

export const variantController = {
    deleteProductVariantById,
}