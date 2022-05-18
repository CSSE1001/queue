import { NextFunction, Request, Response } from "express";
import {
    getOrCreateUserFromHeaderData,
    KVD,
} from "./getOrCreateUserFromHeaderData";

export const uqAuthMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction
): Promise<void> => {
    const username = req.get("X-Uq-User");
    // No username specified.
    if (!username) {
        return next();
    }

    // Return user if found
    const kvd = JSON.parse(req.get("X-Kvd-Payload") || "{}") as KVD;
    req.user = await getOrCreateUserFromHeaderData({ username, kvd });
    return next();
};
