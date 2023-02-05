/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as yaml from "./yaml.js";
import { bastion } from "../types.js";

export const get = (): bastion.Settings => yaml.parse("settings.yaml");
