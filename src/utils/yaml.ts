/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

/**
 * Parse .yaml file into JSON.
 * @param paths A sequence of paths or path segments.
 */
export const parse = (...paths: string[]) => yaml.parse(fs.readFileSync(path.resolve(...paths), "utf8"));
