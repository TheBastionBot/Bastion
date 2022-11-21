/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { BaseChannel, ChannelType } from "discord.js";

const TYPES = {
    [ChannelType.GuildText]: "Text",
    [ChannelType.DM]: "Direct Message",
    [ChannelType.GuildVoice]: "Voice",
    [ChannelType.GroupDM]: "Direct Message Group",
    [ChannelType.GuildCategory]: "Category",
    [ChannelType.GuildAnnouncement]: "Announcement",
    [ChannelType.AnnouncementThread]: "Announcement Thread",
    [ChannelType.PublicThread]: "Public Thread",
    [ChannelType.PrivateThread]: "Private Thread",
    [ChannelType.GuildStageVoice]: "Stage",
    [ChannelType.GuildDirectory]: "Server Directory",
    [ChannelType.GuildForum]: "Forum",
};

/**
 * Resolves a channel type.
 * @param channel The channel (or channel type) which you want to resolve.
 */
export const resolveType = (channel: BaseChannel | ChannelType): string => {
    return TYPES[channel instanceof BaseChannel ? channel.type : channel] || "Unknown";
};
