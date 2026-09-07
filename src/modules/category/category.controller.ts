import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { categoryService } from "./category.service"
import { sendResponse } from "../../utils/apiResponse"
import status from "http-status"

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const data = await categoryService.createCategory(req.body)
    sendResponse(res, {
        status: status.CREATED,
        success: true,
        message: "Category created successfully",
        data
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const data = await categoryService.updateCategory(id, req.body)
    sendResponse(res, {
        status: status.OK,
        success: true,
        message: "Category updated successfully",
        data
    })
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    console.log(id)
    const data = await categoryService.deleteCategory(id)
    sendResponse(res, {
        status: status.OK,
        success: true,
        message: "Category deleted successfully",
        data
    })
})

const getCategoryWithParentAndChildren = catchAsync(async (req: Request, res: Response) => {
    const data = await categoryService.getCategoryWithParentAndChildren()
    sendResponse(res, {
        status: status.OK,
        success: true,
        message: "Category fetched successfully",
        data
    })
});

const getCategoryWithParent = catchAsync(async (req: Request, res: Response) => {
    const data = await categoryService.getCategoryWithParent()
    sendResponse(res, {
        status: status.OK,
        success: true,
        message: "Category fetched successfully",
        data
    })
})

const getCategoryWithChildren = catchAsync(async (req: Request, res: Response) => {
    const data = await categoryService.getCategoryWithChildren()
    sendResponse(res, {
        status: status.OK,
        success: true,
        message: "Category fetched successfully",
        data
    })
})

export const categoryController = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryWithParentAndChildren,
    getCategoryWithParent,
    getCategoryWithChildren

}