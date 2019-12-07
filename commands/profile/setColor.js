/**
 * @file setColor command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (Bastion.methods.isPublicBastion(Bastion)) {
    let patrons = await Bastion.methods.getBastionPatrons();

    if (!patrons.map(p => p.discord_id).includes(message.author.id)) {
      return Bastion.emit('error', '', 'Want to set a custom accent color for your profile? [Support The Bastion Bot Project on Patreon and get access to this as well as other cool perks.](https://patreon.com/bastionbot)', message.channel);
    }
  }

  if (!args.color || !/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(args.color)) {
    return Bastion.emit('commandUsage', message, this.help);
  }


  args.color = args.color.replace('#', '');
  args.color = args.color.length === 3 ? args.color.replace(/(.)/g, '$1$1') : args.color;
  let color = parseInt(args.color, 16);

  await Bastion.database.models.user.update({
    color: color
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'color' ]
  });


  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: `${message.author}, your User Color has been set to **#${args.color}** and will be used in appropriate places.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'color', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'setColor',
  description: 'Sets your user color that is used in the Bastion user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setColor < #HEX_COLOR_CODE >',
  example: [ 'setColor #000000' ]
};
