/**
 * @file announce command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guildSettings = await Bastion.db.all('SELECT announcementChannel FROM guildSettings');
    let announcementChannels = guildSettings.map(guild => guild.announcementChannel).filter(channel => channel);
    let announcementMessage = args.join(' ');

    for (let channel of announcementChannels) {
      if (Bastion.shard) {
        await Bastion.shard.broadcastEval(`
          let channel = this.channels.get('${channel}');
          if (channel) {
            channel.send({
              embed: {
                color: this.colors.BLUE,
                description: \`${announcementMessage.replace('\'', '\\\'')}\`
              }
            }).catch(this.log.error);
          }
        `);
      }
      else {
        await Bastion.channels.get(channel).send({
          embed: {
            color: Bastion.colors.BLUE,
            description: announcementMessage
          }
        }).catch(() => {});
      }
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Announced',
        description: announcementMessage
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
  aliases: [ 'notify' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'announce',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'announce <message>',
  example: [ 'announce Just a random announcement.' ]
};
