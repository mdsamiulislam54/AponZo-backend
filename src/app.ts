import dotenv from "dotenv"
dotenv.config()
import express, { Application, Request, Response } from "express"
import cors from "cors"
import { logger } from "./config/logger"

const app: Application = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(logger)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Apon E-Commerce API is running successfully!',
    });
});


export default app;