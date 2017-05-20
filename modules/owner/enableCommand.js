/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  let command = args[0].toLowerCase();
  if (Bastion.commands.has(command) || Bastion.aliases.has(command)) {
    if (Bastion.commands.has(command)) {
      command = Bastion.commands.get(command);
    }
    else if (Bastion.aliases.has(command)) {
      command = Bastion.commands.get(Bastion.aliases.get(command));
    }
  }
  else {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `\`${command}\` command was not found.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (command.config.enabled) return;
  command.config.enabled = true;

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      description: `\`${command.help.name}\` command has been enabled.`
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['enablecmd'],
  enabled: true
};

exports.help = {
  name: 'enablecommand',
  description: 'Enables a temporarily disabled command.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'enableCommand <command_name>',
  example: ['enableCommand echo']
};
