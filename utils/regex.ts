/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

export const SERVER_INVITE = /(https:\/\/)?(www\.)?(discord\.gg|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/ig;
export const URI = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/ig;

export const REGEX_CMYK = /^(\d{1,2}|100) (\d{1,2}|100) (\d{1,2}|100) (\d{1,2}|100)$/;
export const REGEX_RGB = /^(\d{1,2}|1\d{2}|2[0-5]{2}) (\d{1,2}|1\d{2}|2[0-5]{2}) (\d{1,2}|1\d{2}|2[0-5]{2})$/;
export const REGEX_HEX = /^#?(?:(?:([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2}))|(?:([0-9A-F])([0-9A-F])([0-9A-F])))$/i;
