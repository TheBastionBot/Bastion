/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { User } from "discord.js";


const COLORS = {
    TWITCH: 0x9146ff,
    YOUTUBE: 0xff0000,
    MIXER: 0x1fbaed,

    APEX_LEGENDS: 0xda292a,
    DESTINY_2: 0x9d9a93,
    FORTNITE: 0x149af9,
};

const isPublicBastion = (user: User): boolean => {
    return user.id === "267035345537728512";
};


export {
    COLORS,
    isPublicBastion,
};
