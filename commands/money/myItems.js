/**
 * @file myItems command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let color, title, description;

    let itemsModel = await Bastion.database.models.items.findOne({
      attributes: [ 'custom' ],
      where: {
        userID: message.author.id,
        guildID: message.guild.id
      }
    });

    let userItems;
    if (itemsModel) {
      userItems = itemsModel.dataValues.custom;
    }
    else {
      userItems = [];
    }

    if (userItems.length) {
      color = Bastion.colors.BLUE;
      title = `Items available with ${message.author.tag}`;
      description = userItems.join(', ');
    }
    else {
      color = Bastion.colors.RED;
      title = 'Not Found';
      description = 'You don\'t have any items with you in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
        description: description
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'myItems',
  description: 'Shows the items you\'ve bought from the server\'s shop.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'myItems',
  example: []
};
