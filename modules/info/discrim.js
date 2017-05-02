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
  if (!/^\d{4}$/.test(args[0])) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  let members = message.guild.members.filter(m => m.user.discriminator === args[0]).map(m => m.user);
  let total = members.length;
  members = members.length > 0 ? members.slice(0,10).join(', ') : 'None';

  message.channel.send({embed: {
    color: Bastion.colors.blue,
    title: 'Discriminator search',
    description: `Found **${total}** users with discriminator **${args[0]}**`,
    fields: [
      {
        name: 'Users',
        value: total > 10 ? members + ` and ${total - 10} more.` : members
      }
    ]
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'discrim',
  description: 'Searches the server for users with the specified discriminator.',
  botPermission: '',
  permission: '',
  usage: 'discrim <discriminator>',
  example: ['discrim 8383']
};
