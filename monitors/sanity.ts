/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as crypto from "crypto";
import { promises as fs } from "fs";
import { Monitor } from "@bastion/tesseract";
import { Team, User } from "discord.js";

export = class SanityMonitor extends Monitor {
    public static e = "747b39ccb8b69";

    private a: string;
    private errorCode = 0xBAADB002;

    constructor() {
        super("sanity", {
            event: "ready",
            frequency: 13 * 60,
        });
    }

    exec = async (): Promise<void> => {
        // don't do anything if it's my Bastion
        if (this.client.user.id === "267035345537728512") return;

        const app = await this.client.fetchApplication().catch(() => {
            // this error can be ignored
        });
        if (!app) return;

        const owner: User = app.owner instanceof Team ? app.owner.owner.user : app.owner;

        // if it's one of mine, it can do whatever the hell it wants
        if (owner.id === "266290969974931457") return;

        // if it's a public bot, don't allow it to run
        if (app.botPublic) {
            process.stderr.write("\n\n" + Buffer.from("RkFUQUwgRVJST1I6IDB4QkFBREIwMDIKCkdvIHRvIHlvdXIgQm90J3MgYXBwbGljYXRpb24gcGFnZSBpbiBEaXNjb3JkIERldmVsb3BlcnMgc2l0ZSBhbmQgZGlzYWJsZSB0aGUgIlB1YmxpYyBCb3QiIG9wdGlvbi4KClBsZWFzZSBjb250YWN0IHRoZSBzdXBwb3J0IHRlYW0gYXQgQmFzdGlvbiBIUSAtIGh0dHBzOi8vZGlzY29yZC5nZy9meng4Zmt0IC0gZm9yIG1vcmUgaW5mb3JtYXRpb24u", "base64").toString("utf-8") + "\n\n\n");

            if (this.client.shard) {
                await this.client.shard.broadcastEval("this.destroy();process.exitCode = " + this.errorCode + ";");
            } else {
                this.client.destroy();
                process.exitCode = this.errorCode;
                process.exit(this.errorCode);
            }
        }

        // find the hash of the constants file
        if (typeof this.a !== "string") {
            this.a = crypto.createHash("sha256").update(await fs.readFile("./locales/constants.yaml", "utf-8"), "utf8").digest("hex").slice(-13);
        }

        // check whether the constants are modified
        if (this.a !== SanityMonitor.e) {
            if (this.client.shard) {
                await this.client.shard.broadcastEval("this.destroy();process.exitCode = " + this.errorCode + ";");
            } else {
                this.client.destroy();
                process.exitCode = this.errorCode;
                process.exit(this.errorCode);
            }
        }
    }
}
