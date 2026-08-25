import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authService } from "./auth.service"
import { sendResponse } from "../../utils/apiResponse"
import status from "http-status"

const createUser = catchAsync(async (req: Request, res: Response) => {
    console.log("HI AUTH.........")
    const user = await authService.createUser(req.body)

    sendResponse(res, {
        success: true,
        message: "User Create successful!",
        status: status.CREATED,
        data: user
    })
})


export const authController = {
    createUser
}