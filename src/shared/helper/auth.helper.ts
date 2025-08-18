import * as bcrypt from "bcrypt";
import { Request, Response } from "express";

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = (sameSite: "lax" | "strict" = "lax") => ({
    httpOnly: true,
    secure: false,
    sameSite,
    maxAge: COOKIE_MAX_AGE,
});

export const setAccessTokenToHeader = (res: Response, accessToken: string) => {
    res.setHeader("Authorization", `Bearer ${accessToken}`);
};
export const removeAccessTokenFromHeader = (res: Response) => {
    res.removeHeader("Authorization");
};

const setCookie = (
    res: Response,
    name: string,
    value: string,
    sameSite: "lax" | "strict" = "lax",
) => {
    res.cookie(name, value, cookieOptions(sameSite));
};

const clearCookie = (
    res: Response,
    name: string,
    sameSite: "lax" | "strict" = "lax",
) => {
    res.clearCookie(name, cookieOptions(sameSite));
};

export const setRefreshTokenToCookie = (res: Response, token: string) =>
    setCookie(res, "refreshToken", token);
export const clearRefreshTokenFromCookie = (res: Response) =>
    clearCookie(res, "refreshToken");

export const extractAccessTokenFromHeader = (
    req: Request,
): string | undefined => {
    const authHeader = req.headers.authorization;
    return authHeader ? authHeader.split(" ")[1] : undefined;
};

export const extractAccessTokenFromCookie = (
    req: Request,
): string | undefined => {
    return req.cookies.accessToken;
};

export const extractRefreshTokenFromCookie = (
    req: Request,
): string | undefined => {
    return req.cookies.refreshToken;
};

export const hash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const compare = async (
    password: string,
    hashedPassword: string,
): Promise<boolean> => {
    if (!password || !hashedPassword) {
        return false;
    }

    return await bcrypt.compare(password, hashedPassword);
};
