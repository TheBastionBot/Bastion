/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ShardingManager } from "@bastion/tesseract";
import { NextFunction, Request, Response, Router } from "express";
import { InternalServerError } from "http-errors";

import auth from "../middlewares/auth";

const router = Router();

router.get("/", auth, async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const shardingManger: ShardingManager = req.app.get("shard-manager");

        const shards = await shardingManger.broadcastEval(client => ({
            shard: client.shard.ids.join(" / "),
            uptime: client.uptime,
            wsStatus: client.ws.status,
            wsPing: client.ws.ping,
            guildCount: client.guilds.cache.size,
        }));

        return res.status(200).json(shards);
    } catch {
        next(InternalServerError());
    }
});

export = router;
