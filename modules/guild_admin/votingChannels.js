/**
 * @file votingChannels command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.add || args.remove) {
      await Bastion.database.models.textChannel.upsert({
        channelID: message.channel.id,
        guildID: message.guild.id,
        votingChannel: !!args.add
      },
      {
        where: {
          channelID: message.channel.id,
          guildID: message.guild.id
        },
        fields: [ 'channelID', 'guildID', 'votingChannel' ]
      });

      let color, description;
      if (args.add) {
        color = Bastion.colors.GREEN;
        description = `${message.channel} has been added to the list of voting channels.`;
      }
      else {
        color = Bastion.colors.RED;
        description = `${message.channel} has been removed from the list of voting channels.`;
      }

      message.channel.send({
        embed: {
          color: color,
          description: description
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (args.purge) {
      await Bastion.database.models.textChannel.upsert({
        guildID: message.guild.id,
        votingChannel: false
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'guildID', 'votingChannel' ]
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: 'All the channels have been removed from the list of voting channels.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      let guildModel = await Bastion.database.models.textChannel.findAll({
        attributes: [ 'channelID' ],
        where: {
          guildID: message.guild.id,
          votingChannel: true
        }
      });

      let votingChannels, description;
      if (!guildModel || !guildModel.length) {
        description = 'No voting channels have been set in this server.';
      }
      else {
        votingChannels = guildModel.map(guild => guild.dataValues.channelID);
        description = `Messages posted in the voting channels can are available for upvote/downvote by users.\n\nThese channels have been set as the voting channels:\n\n<#${votingChannels.join('>, <#')}>`;
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          description: description
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'votingChannel' ],
  enabled: true,
  argsDefinitions: [
    { name: 'add', type: Boolean, alias: 'a' },
    { name: 'remove', type: Boolean, alias: 'r' },
    { name: 'purge', type: Boolean, alias: 'p' }
  ]
};

exports.help = {
  name: 'votingChannels',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'votingChannels [ --add | --remove | --purge ]',
  example: [ 'votingChannels', 'votingChannels --add', 'votingChannels --remove', 'votingChannel --purge' ]
};
