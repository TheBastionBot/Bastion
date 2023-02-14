/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ClientUser, Snowflake } from "discord.js";

export const BASTION_USER_ID = "267035345537728512";

export enum COLORS {
    PRIMARY = 4244731,
    SECONDARY = 6478331,
    LIGHT = 16119285,
    SOMEWHAT_DARK = 2303786,
    DARK_BUT_NOT_BLACK = 790033,
    NOT_SO_BLACK = 461324,
    BLUE = 31487,
    GREEN = 3458905,
    INDIGO = 5789398,
    ORANGE = 16749824,
    PINK = 16723285,
    PURPLE = 11490014,
    RED = 16726832,
    TEAL = 5949690,
    YELLOW = 16763904,

    TWITCH = 0x9146ff,
    YOUTUBE = 0xff0000,

    AIM_LAB = 0x68c7c3,
    APEX_LEGENDS = 0xda292a,
    CSGO = 0xf3a11d,
    DESTINY_2 = 0x9d9a93,
    FORTNITE = 0x149af9,
    OVERWATCH = 0xed6516,
    PUBG = 0xf2a900,
    RAINBOW6 = 0x36a9e0,
    ROCKET_LEAGUE = 0x0475d0,
    VALORANT = 0xff4655,
}

export enum SelectRolesType {
    AddOnly = 1,
    RemoveOnly = 2,
}

export enum SelectRolesUI {
    Buttons = 0,
    SelectMenu = 1,
}

export const isPublicBastion = (user: ClientUser | Snowflake): boolean => {
    return typeof user === "string" ? user === BASTION_USER_ID : user.id === BASTION_USER_ID;
};
