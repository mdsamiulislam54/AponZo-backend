import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authService } from "./auth.service"
import { sendResponse } from "../../utils/apiResponse"
import status from "http-status"
import { cookieUtils } from "../../utils/cookie"

const createUser = catchAsync(async (req: Request, res: Response) => {
    console.log("HI AUTH.........", req.body)
    const user = await authService.createUser(req.body)
    const { accessToken, refreshToken, token, ...rest } = user

    cookieUtils.setCookie(res, "refreshToken", refreshToken!, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    cookieUtils.setCookie(res, "accessToken", accessToken!, {
        httpOnly: true,
    })

    cookieUtils.setBetterAuthToken(res, token!)
    sendResponse(res, {
        success: true,
        message: "User Create successful!",
        status: status.CREATED,
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest,
        }
    })
})
const loginUser = catchAsync(async (req: Request, res: Response) => {
    console.log("HI AUTH.........")
    const user = await authService.loginUser(req.body)
    const { accessToken, refreshToken, token, ...rest } = user

    cookieUtils.setCookie(res, "refreshToken", refreshToken!, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    cookieUtils.setCookie(res, "accessToken", accessToken!, {
        httpOnly: true,
    })

    cookieUtils.setBetterAuthToken(res, token!)
    sendResponse(res, {
        success: true,
        message: "User login successful!",
        status: status.OK,
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest,
        }
    })
})

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const data = await authService.forgotPassword(req.body)
    sendResponse(res, {
        success: true,
        message: data.message,
        status: status.OK,

    })
})
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const data = await authService.resetPassword(req.body)
    sendResponse(res, {
        success: true,
        message: data.message,
        status: status.OK,
    })
})

export const authController = {
    createUser,
    loginUser,
    forgotPassword,
    resetPassword
}