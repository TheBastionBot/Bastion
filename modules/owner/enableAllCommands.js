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

  Bastion.commands.filter(cmd => {
    cmd.config.enabled = true;
  });

  message.channel.send({embed: {
    color: Bastion.colors.red,
    description: `All commands have been disabled until next restart. You can enable all commands using \`${Bastion.config.prefix}enableAllCommands\`. Or you can enable any specific command using \`${Bastion.config.prefix}enableCommand <command_name>\`.`
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['enableallcmds'],
  enabled: true
};

exports.help = {
  name: 'enableallcommands',
  description: 'Enables all temporarily disabled commands.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'enableAllCommands',
  example: []
};
