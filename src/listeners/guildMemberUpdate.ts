/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildMember, PartialGuildMember } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { logGuildEvent } from "../utils/guilds.js";

class GuildMemberUpdateListener extends Listener<"guildMemberUpdate"> {
    constructor() {
        super("guildMemberUpdate");
    }

    public async exec(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember): Promise<void> {
        if (oldMember.nickname !== newMember.nickname) {
            await logGuildEvent(newMember.guild, {
                title: `Nickname ${ newMember.nickname ? "Updated" : "Removed" }`,
                fields: [
                    {
                        name: "Member",
                        value: newMember.user.tag,
                        inline: true,
                    },
                    {
                        name: "ID",
                        value: newMember.id,
                        inline: true,
                    },
                    {
                        name: "Nickname",
                        value: `${ oldMember.nickname || oldMember.user.username } ➜ **${ newMember.nickname || newMember.user.username }**`,
                        inline: true,
                    },
                ],
                timestamp: new Date().toISOString(),
            });
        }
    }
}

export { GuildMemberUpdateListener as Listener };
