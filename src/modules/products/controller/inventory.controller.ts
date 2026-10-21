import status from "http-status";
import { sendResponse } from "../../../utils/apiResponse";
import { catchAsync } from "../../../utils/catchAsync";
import { product_image_service } from "../service/products.image.service";
import { Request, Response } from "express";
import { inventorService } from "../service/inventory.service";
import { getPagination } from "../../../utils/pagination";
import { IQueryParams } from "../../../type/QueryParamsType";

const getInventory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const query = req.query as IQueryParams;
    console.log(query);
    const product = await inventorService.getInventory(userId, query);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Inventor  retrieved successfully",
        data: product,
    });
});



export const inventoryController = {
    getInventory,
    // createProduct,
    // updateProduct,
    // deleteProduct,
    // getProduct,
    // getProducts,
}