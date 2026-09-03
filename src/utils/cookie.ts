import { CookieOptions, Response } from "express";
import envConfig from "../config/env";


const setCookie = (res: Response, key: string, value: string, options: CookieOptions) => {
    res.cookie(key, value, options)
}

const getCookie = (req: any, key: string) => {
    return req.cookies[key]
}

const setBetterAuthToken = (res: Response, token: string) => {
    res.cookie('better-auth.session-token', token, {
        httpOnly: true,
        secure: envConfig.env === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7 
    })
}
const removeCookie = (res: Response, key: string) => {
    res.clearCookie(key)
}

export const cookieUtils = { setCookie, getCookie, removeCookie,setBetterAuthToken }