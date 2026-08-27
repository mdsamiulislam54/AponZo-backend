import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodObject, ZodRawShape, z } from "zod";
export interface IErrorSource {
    path: string,
    message: string
}

export const zodValidation = <T extends ZodRawShape>(schema: ZodObject<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
       
        try {
            if (req.body && typeof req.body.data === 'string') {
                try {
                    
                    req.body = JSON.parse(req.body.data);
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        error: [{ path: "data", message: "Invalid json" }]
                    })
                }
            }

            const validated = schema.safeParse(req.body);
            
            if (!validated.success) {
                next(validated.error)
            }
            req.body = validated.data;
            next();
        } catch (error) {
            next(error)
        }
    }
}


export const zodValidationError = (err: z.ZodError) => {
    const statusCode = status.BAD_REQUEST;
    const errorMessage = "Zod Validation Error"
    const errorSource: IErrorSource[] = [];
    if (err instanceof z.ZodError) {
        err.issues.forEach((issue) => {
            errorSource.push({
                message: issue.message,
                path: issue.path.join(" ").toString()
            })
        })
    }

    return {
        success: false,
        message: errorMessage,
        err: err.message,
        errorSource,
        statusCode

    }
}