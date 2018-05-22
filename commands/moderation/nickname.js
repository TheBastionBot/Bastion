/**
 * @file nickname command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await Bastion.fetchUser(args.id);
    }
    if (!user) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let member = await message.guild.fetchMember(user.id);
    if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return Bastion.log.info(Bastion.i18n.error(message.guild.language, 'lowerRole'));

    let color;
    let nickStat = '';
    if (message.guild.ownerID === message.author.id) {
      color = Bastion.colors.RED;
      nickStat = 'Can\'t change server owner\'s nickname.';
    }
    else {
      args.nick = args.nick.join(' ');

      if (args.nick > 32) {
        color = Bastion.colors.RED;
        nickStat = 'Nickname can\'t be longer than 32 characters.';
      }
      else {
        if (args.nick < 1) {
          color = Bastion.colors.RED;
          nickStat = Bastion.i18n.info(message.guild.language, 'removeNickname', message.author.tag, user.tag);
        }
        else {
          color = Bastion.colors.GREEN;
          nickStat = Bastion.i18n.info(message.guild.language, 'setNickname', message.author.tag, user.tag, args.nick);
        }
      }
      await member.setNickname(args.nick);
    }

    message.channel.send({
      embed: {
        color: color,
        description: nickStat
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'nick' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'nick', alias: 'n', type: String, multiple: true, defaultValue: [] }
  ]
};

exports.help = {
  name: 'nickname',
  description: 'Sets the nickname of the specified user of your Discord server.',
  botPermission: 'MANAGE_NICKNAMES',
  userTextPermission: 'MANAGE_NICKNAMES',
  userVoicePermission: '',
  usage: 'nickname < @USER_MENTION | USER_ID > [-n nick]',
  example: [ 'nickname @user#0001 -n The Legend', 'nickname 167147569575323761' ]
};
