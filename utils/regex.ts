/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

const SERVER_INVITE = /(https:\/\/)?(www\.)?(discord\.gg|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/ig;
const URI = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/ig;

export {
    SERVER_INVITE,
    URI,
};
