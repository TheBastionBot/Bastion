/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";

import * as settings from "../utils/settings";

export default (req: Request, _: Response, next: NextFunction): void => {
    const authorization: string = req.get("Authorization");

    if (authorization && authorization === settings.get()?.auth) next();
    else next(Unauthorized());
};
