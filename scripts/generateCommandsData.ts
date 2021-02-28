/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";


const walkDirectory = (directory: string): string[] => {
    const filepaths: string[] = [];

    (function walk(directory: string): void {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filepath = path.join(directory, file);

            if (fs.statSync(filepath).isDirectory()) walk(filepath);
            else filepaths.push(filepath);
        }
    })(directory);

    return filepaths;
};


const commandsDirectory = path.resolve("./commands/");

if (fs.existsSync(commandsDirectory)) {
    const files = walkDirectory(commandsDirectory);

    const commandStrings: { [ command: string ]: string } = {};
    const commands: { [ category: string ]: {
        name: string;
        description: string;
        triggers: string[];
        scope: string;
        owner: boolean;
        typing: boolean;
        schedulable: boolean;
        unsafe: boolean;
        nsfw: boolean;
        cooldown: number;
        ratelimit: number;
        clientPermission: string[];
        userPermissions: string[];
        syntax: string[];
    }[]; } = {};

    for (const file of files.filter(file => file.endsWith(".js"))) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Command = require(file);
        const command = new Command();
        const commandCategory = path.dirname(path.relative(commandsDirectory, file));

        commandStrings[command.name] = command.description;

        if (commandCategory in commands) {
            commands[commandCategory].push({
                name: command.name,
                description: command.description,
                triggers: command.triggers,
                scope: command.scope,
                owner: command.owner,
                typing: command.typing,
                schedulable: command.schedulable,
                unsafe: command.unsafe,
                nsfw: command.nsfw,
                cooldown: command.cooldown,
                ratelimit: command.ratelimit,
                clientPermission: command.clientPermission,
                userPermissions: command.userPermissions,
                syntax: command.syntax,
            });
        } else {
            commands[commandCategory] = [ {
                name: command.name,
                description: command.description,
                triggers: command.triggers,
                scope: command.scope,
                owner: command.owner,
                typing: command.typing,
                schedulable: command.schedulable,
                unsafe: command.unsafe,
                nsfw: command.nsfw,
                cooldown: command.cooldown,
                ratelimit: command.ratelimit,
                clientPermission: command.clientPermission,
                userPermissions: command.userPermissions,
                syntax: command.syntax,
            } ];
        }
    }

    // save command strings
    fs.writeFileSync("./locales/en_us/commands.yaml", yaml.stringify(commandStrings), {
        encoding: "utf-8",
    });

    // save command data
    fs.writeFileSync("./assets/commands.json", JSON.stringify(commands), {
        encoding: "utf-8",
    });
}
