
import status from "http-status";
import { sendResponse } from "../../../utils/apiResponse";
import { catchAsync } from "../../../utils/catchAsync";

import { Request, Response } from "express";
import { specificationService } from "../service/products.specification.service";


const deleteSpecificationById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const specificationId = req.params.id as string;
    const product = await specificationService.deleteSpecificationById(userId, specificationId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Specification  delete successfully",
        data: product,
    });
});

export const specificationController = {
    deleteSpecificationById,
}