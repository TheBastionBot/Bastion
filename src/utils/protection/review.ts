/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { APIEmbed, APIEmbedField, Embed } from "discord.js";

/**
 * Record a moderator's review on the incident report. Every review goes into
 * the same field, listed once there's more than one, so a report that's been
 * acted on repeatedly doesn't grow a new field per click.
 * @param embed The incident report's embed.
 * @param entry What the moderator did.
 */
export const appendModerator = (embed: Embed, entry: string): APIEmbed => {
    const json = embed.toJSON();
    const fields = [ ...(json.fields ?? []) ];

    // matched by prefix, since the field is renamed once it holds a list
    const index = fields.findIndex(field => field.name.startsWith("Moderator"));

    const recorded = index < 0
        ? []
        : fields[index].value.split("\n").map(line => line.replace(/^• /, ""));

    const entries = [ ...recorded, entry ];

    const field: APIEmbedField = {
        name: entries.length > 1 ? "Moderators" : "Moderator",
        value: entries.length > 1 ? entries.map(recording => `• ${ recording }`).join("\n") : entries[0],
    };

    if (index < 0) fields.push(field);
    else fields[index] = field;

    return { ...json, fields };
};
