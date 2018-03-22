/**
 * @file myItems command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let color, title, description;

    let userItems = await Bastion.db.get(`SELECT custom_items FROM shop_items WHERE userID='${message.author.id}' AND guildID='${message.guild.id}'`);

    if (userItems && userItems.custom_items) {
      userItems = await Bastion.functions.decodeString(userItems.custom_items);
      userItems = JSON.parse(userItems);
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
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'myItems',
  example: []
};
