import { auth } from "../../lib/auth"

type BUSINESS_TYPE = "INDIVIDUAL" | "COMPANY" | "PARTNERSHIP"
export type SignUpResponse = Awaited<ReturnType<typeof auth.api.signUpEmail>>
// src/constants/user.constant.ts


export interface ICreateUser {
    name:string,
    email:string,
    password:string,
    role?:string,
    businessName?:string,
    businessType?:BUSINESS_TYPE,
}
export interface ILoginUser {
    email:string,
    password:string
}


    
