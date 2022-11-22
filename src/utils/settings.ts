/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import fs from "node:fs";
import path from "node:path";
import * as yaml from "yaml";

import { bastion } from "../types";

export const get = (): bastion.Settings => yaml.parse(fs.readFileSync(path.resolve("settings.yaml"), "utf8"));
