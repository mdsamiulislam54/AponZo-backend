import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import status from "http-status";
import { AppError } from "./appErrors";
import { prisma } from "../lib/prisma";

const authorization = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("Authorization middleware called with roles:", roles);
        const sessionToken = cookieUtils.getCookie(req, "better-auth.session-token");
        if (!sessionToken) throw new AppError(status.UNAUTHORIZED, "No session token found in cookies");

        if (sessionToken) {
            const sessionExists = await prisma.session.findUnique({
                where: {
                    token: sessionToken
                },
                include: {
                    user: true
                }
            })

            if (!sessionExists) throw new AppError(status.UNAUTHORIZED, "Session token not found in database");

            if (sessionExists) {
                const user = sessionExists.user;
                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt);
                const createdAt = new Date(sessionExists.createdAt);

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

                if (percentRemaining < 20) {
                    res.setHeader("X-Session-Refresh", "true");
                    res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                    res.setHeader("X-Time-Remaining", timeRemaining.toString());
                }

                if (user.status === "INACTIVE" || user.isDeleted === true) throw new AppError(status.UNAUTHORIZED, "User is inactive or deleted");


                if (roles.length > 0 && !roles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, "You are not authorized to perform this action");
                }

                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                };

            }
        };

        next();
    }
}

export { authorization }
