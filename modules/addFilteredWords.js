/**
 * @file addFilteredWords command
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

    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'filteredWords' ],
      where: {
        guildID: message.guild.id
      }
    });

    let filteredWords = [];
    if (guildModel.dataValues.filteredWords) {
      filteredWords = guildModel.dataValues.filteredWords;
    }
    filteredWords = filteredWords.concat(args);
    filteredWords = [ ...new Set(filteredWords) ];

    await Bastion.database.models.guild.update({
      filteredWords: filteredWords
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filteredWords' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Added Words to Filter List',
        description: args.join(', ')
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
  aliases: [ 'addfw' ],
  enabled: true
};

exports.help = {
  name: 'addFilteredWords',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addFilteredWords word [anotherWord] [someOtherWord]',
  example: [ 'addFilteredWords cast creed race religion' ]
};
