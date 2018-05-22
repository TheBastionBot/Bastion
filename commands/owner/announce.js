/**
 * @file announce command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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

    let guildModels = await Bastion.database.models.guild.findAll({
      attributes: [ 'announcementChannel' ]
    });

    let announcementChannels = guildModels.filter(guildModel => guildModel.dataValues.announcementChannel).map(guildModel => guildModel.dataValues.announcementChannel);
    let announcementMessage = args.join(' ');

    for (let channel of announcementChannels) {
      if (Bastion.shard) {
        await Bastion.shard.broadcastEval(`
          let channel = this.channels.get('${channel}');
          if (channel) {
            channel.send({
              embed: {
                color: this.colors.BLUE,
                description: \`${announcementMessage}\`
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
  description: 'Send a message to announcement channel of all the servers Bastion is connected to.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'announce <message>',
  example: [ 'announce Just a random announcement.' ]
};
