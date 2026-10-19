import { Request, Response, NextFunction } from "express";
import { AppError } from "./appErrors";
import status from "http-status";
const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(
        new AppError(
            status.NOT_FOUND,
            `Route not found: ${req.method} ${req.originalUrl}`
        )
    )
}

export default notFound;