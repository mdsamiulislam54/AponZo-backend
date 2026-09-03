import dotenv from "dotenv"
dotenv.config()
import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import { logger } from "./config/logger"
import { apiRoutes } from "./utils/route"

import globalErrorHandler from "./middlewares/error.middleware"

const app: Application = express()

app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(logger)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Apon E-Commerce API is running successfully!',
    });
});

app.use("/api/v1", apiRoutes);

app.use(globalErrorHandler)

export default app;