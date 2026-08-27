import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken = (payload: JwtPayload, secret: string, { expiresIn }: SignOptions) => {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;

}

const verifyToken = (token: string, secret: string) => {
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        const message = (error as Error).message;
        return {
            success: false,
            message,
            error
        }
    }
}


const decodeToken = (token: string) => {
    try {
        const payload = jwt.decode(token);
        return payload;
    } catch (error) {
        const message = (error as Error).message;
        return {
            success: false,
            message,
            error
        }
    }
}

export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken
}