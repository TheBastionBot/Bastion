/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { User } from "discord.js";

const isPublicBastion = (user: User): boolean => {
    return user.id === "267035345537728512";
};


export {
    isPublicBastion,
};
