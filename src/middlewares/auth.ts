/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { NextFunction, Request, Response } from "express";
import httpError from "http-errors";

import Settings from "../utils/settings.js";

export default (req: Request, _: Response, next: NextFunction): void => {
    const settings = new Settings();
    const authorization: string = req.get("Authorization");

    if (authorization && authorization === settings.auth) next();
    else next(httpError(401));
};
