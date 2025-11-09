/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import fs from "node:fs";
import path from "node:path";
import { Settings } from "@bastion/tesseract";
import YAML from "yaml";

import { bastion } from "../types.js";

export default class BastionSettings extends Settings {
    declare protected data: bastion.Settings;

    constructor() {
        super();
    }

    /** Port */
    public get port(): string | 8377 {
        return process.env.BASTION_API_PORT || process.env.PORT || 8377;
    }

    /** Auth */
    public get auth(): string {
        return process.env.BASTION_API_AUTH || this.data.auth;
    }

    /** Music Activity */
    public get musicActivity(): boolean {
        if (process.env.BASTION_MUSIC_ACTIVITY) {
            if (process.env.BASTION_MUSIC_ACTIVITY.toLowerCase() === "true") return true;
            if (process.env.BASTION_MUSIC_ACTIVITY.toLowerCase() === "false") return false;
        }
        return this.data.musicActivity;
    }

    /** Relay Direct Messages */
    public get relayDirectMessages(): boolean | string {
        if (process.env.BASTION_RELAY_DMS) {
            if (process.env.BASTION_RELAY_DMS.toLowerCase() === "true") return true;
            if (process.env.BASTION_RELAY_DMS.toLowerCase() === "false") return false;
            return process.env.BASTION_RELAY_DMS;
        }
        return this.data.relayDirectMessages;
    }

    public get<K extends keyof bastion.Settings>(key: K): bastion.Settings[K] {
        return this.data[key];
    }

    public set<K extends keyof bastion.Settings>(key: K, value: bastion.Settings[K]): void {
        const settingsPath = path.resolve("settings.yaml");
        const fileContent = fs.readFileSync(settingsPath, "utf8");
        const doc = YAML.parseDocument(fileContent);

        if (doc.contents && YAML.isMap(doc.contents)) {
            const keyString = String(key);
            const existingPair = doc.contents.items.find(item =>
                YAML.isPair(item) && item.key && YAML.isScalar(item.key) && item.key.value === keyString
            );

            if (existingPair && YAML.isPair(existingPair)) {
                if (YAML.isMap(existingPair.value) && typeof value === "object" && value !== null) {
                    for (const [ nestedKey, nestedValue ] of Object.entries(value)) {
                        const nestedPair = existingPair.value.items.find(item =>
                            YAML.isPair(item) && item.key && YAML.isScalar(item.key) && item.key.value === nestedKey
                        );

                        if (nestedPair && YAML.isPair(nestedPair)) {
                            const nestedValueDoc = YAML.parseDocument(YAML.stringify(nestedValue));
                            if (nestedValueDoc.contents) {
                                nestedPair.value = nestedValueDoc.contents;
                            }
                        } else if (YAML.isMap(existingPair.value)) {
                            const nestedValueDoc = YAML.parseDocument(YAML.stringify(nestedValue));
                            if (nestedValueDoc.contents) {
                                const nestedKeyNode = YAML.parseDocument(YAML.stringify(nestedKey)).contents;
                                if (nestedKeyNode && YAML.isScalar(nestedKeyNode)) {
                                    const newNestedPair = new YAML.Pair(nestedKeyNode, nestedValueDoc.contents);
                                    existingPair.value.items.push(newNestedPair);
                                }
                            }
                        }
                    }
                } else {
                    const valueDoc = YAML.parseDocument(YAML.stringify(value));
                    if (valueDoc.contents) {
                        existingPair.value = valueDoc.contents;
                    }
                }
            } else {
                const valueDoc = YAML.parseDocument(YAML.stringify(value));
                if (valueDoc.contents && YAML.isMap(doc.contents)) {
                    const keyNode = YAML.parseDocument(YAML.stringify(keyString)).contents;
                    if (keyNode && YAML.isScalar(keyNode)) {
                        const newPair = new YAML.Pair(keyNode, valueDoc.contents);
                        doc.contents.items.push(newPair);
                    }
                }
            }
        }

        fs.writeFileSync(settingsPath, doc.toString());
    }
}
