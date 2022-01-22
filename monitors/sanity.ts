/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as crypto from "crypto";
import { promises as fs } from "fs";
import { Monitor } from "@bastion/tesseract";

export = class SanityMonitor extends Monitor {
    public static e = "1ead86a47ecab";

    private a: string;
    private errorCode = 0xBAADB002;

    constructor() {
        super("sanity", {
            event: "ready",
            frequency: 13 * 60,
        });
    }

    exec = async (): Promise<void> => {
        // find the hash of the constants file
        if (typeof this.a !== "string") {
            this.a = crypto.createHash("sha256").update(await fs.readFile("./locales/constants.yaml", "utf-8"), "utf8").digest("hex").slice(-13);
        }

        // check whether the constants are modified
        if (this.a !== SanityMonitor.e) {
            process.stderr.write("\n\n" + Buffer.from("RkFUQUwgRVJST1I6IDB4QkFBREIwMDIKCllvdSBzZWVtIHRvIGhhdmUgbW9kaWZpZWQgQmFzdGlvbidzIGNvbnN0YW50cy4gVGhhdCBjb250YWlucyB2YWx1ZXMgdGhhdCBhcmUgcmVxdWlyZWQgdG8gcnVuIEJhc3Rpb24uCgpQbGVhc2UgY29udGFjdCB0aGUgc3VwcG9ydCB0ZWFtIGF0IEJhc3Rpb24gSFEgLSBodHRwczovL2Rpc2NvcmQuZ2cvZnp4OGZrdCAtIGZvciBtb3JlIGluZm9ybWF0aW9uLg", "base64").toString("utf-8") + "\n\n\n");

            if (this.client.shard) {
                await this.client.shard.broadcastEval("this.destroy();process.exitCode = " + this.errorCode + ";");
            } else {
                this.client.destroy();
                process.exitCode = this.errorCode;
                process.exit(this.errorCode);
            }
        }
    };
}
