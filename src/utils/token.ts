import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import envConfig from "../config/env";

const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envConfig.jwt_secret!, {
        expiresIn: envConfig.access_token_expires_in
    } as SignOptions
    );
    return accessToken; 
}

const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envConfig.jwt_secret!, {
        expiresIn: envConfig.refresh_token_expires_in
    } as SignOptions
    );
    return refreshToken;
}

const generateToken = (payload: JwtPayload) => {
    const accessToken = getAccessToken(payload);
    const refreshToken = getRefreshToken(payload);
    return {
        accessToken,
        refreshToken
    }
}

export { getAccessToken, getRefreshToken,generateToken }