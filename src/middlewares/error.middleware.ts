import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/client";
import envConfig from "../config/env";
import z from "zod";
import { IErrorSource, zodValidationError } from "./zodValidation";
import { APIError } from "better-auth/api";
const globalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = "Internal Server Error";
    let errorSource: IErrorSource[] = [];

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409;
                message = "A record with this value already exists.";
                break;

            case "P2025":
                statusCode = 404;
                message = "The requested record was not found.";
                break;

            case "P2003":
                statusCode = 400;
                message = "Foreign key constraint failed.";
                break;

            case "P2014":
                statusCode = 400;
                message = "Required relation is missing.";
                break;

            default:
                statusCode = 400;
                message = "Database request failed.";
        }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid database query"
    }
    else if (err instanceof APIError) {
        statusCode = err.statusCode || 500;
        message = err.body?.message || err.message
        errorSource = err?.body?.errorSource
    }
    
    else if (err instanceof Error) {
        statusCode = (err as any).statusCode || 400;
        message = err.message
    }
    if (err instanceof z.ZodError) {
        const zodError = zodValidationError(err)
        statusCode = zodError.statusCode
        message = zodError.message
        errorSource = zodError.errorSource

    }
    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        ...(envConfig.env === "development" && {

            errorSource,
            error: err,
        })


    })
}

export default globalErrorHandler