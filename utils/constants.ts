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
    CSGO: 0xf3a11d,
    DESTINY_2: 0x9d9a93,
    FORTNITE: 0x149af9,
    PUBG: 0xf2a900,
    RAINBOW6: 0x36a9e0,
    ROCKET_LEAGUE: 0x0475d0,

    PATREON: 0xff514d,
};

const isPublicBastion = (user: User): boolean => {
    return user.id === "267035345537728512";
};


export {
    COLORS,
    isPublicBastion,
};
