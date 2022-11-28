/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as yaml from "./yaml";
import { bastion } from "../types";

export const get = (): bastion.Settings => yaml.parse("settings.yaml");
