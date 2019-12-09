/**
 * @file reactionRolesGroup command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Sequelize = xrequire('sequelize');

exports.exec = async (Bastion, message, args) => {
  let reactionRolesGroupModels = await Bastion.database.models.reactionRolesGroup.findAll({
    fields: [ 'messageID' ],
    where: {
      guildID: message.guild.id
    }
  });


  if (!args.roles) {
    let reactionRolesGroups = reactionRolesGroupModels.map(model => model.dataValues.messageID);


    if (args.remove) {
      if (reactionRolesGroups.includes(args.remove)) {
        await Bastion.database.models.reactionRolesGroup.destroy({
          where: {
            messageID: args.remove,
            guildID: message.guild.id
          }
        });

        return message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            title: 'Reaction Roles Group Removed',
            description: `The Reaction Roles Group associated with the message ${args.remove} has been successfully removed.`
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
    }


    if (!reactionRolesGroups.length) {
      return Bastion.emit('commandUsage', message, this.help);
    }

    return await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Reaction Roles Groups',
        description: reactionRolesGroups.map((group, index) => `${index + 1}. ${group}`).join('\n')
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }


  if (Bastion.methods.isPublicBastion(Bastion)) {
    let limit = 2;

    let patrons = await Bastion.methods.getBastionPatrons().catch(() => {});
    if (patrons && patrons.map(p => p.discord_id).includes(message.guild.ownerID)) {
      let patron = patrons.find(p => p.discord_id === message.guild.ownerID);
      limit += parseInt(patron.amount_cents / 100) * 2;
    }

    if (!Bastion.credentials.ownerId.includes(message.guild.ownerID) && reactionRolesGroupModels && reactionRolesGroupModels.length >= limit) {
      return Bastion.emit('error', '', `You can't set more than ${limit} Reaction Roles Group. Want to set more Reaction Roles Group? [You can get 2 extra Reaction Roles Group for every dollar you donate towards supporting The Bastion Bot Project on Patreon, as well as other cool perks.](https://patreon.com/bastionbot)`, message.channel);
    }
  }


  let roleModels = await Bastion.database.models.role.findAll({
    attributes: [ 'roleID', 'emoji' ],
    where: {
      guildID: message.guild.id,
      emoji: {
        [Sequelize.Op.not]: null
      }
    }
  });


  let reactionRolesIDs = roleModels.map(model => model.dataValues.roleID);

  args.roles = args.roles.filter(role => message.guild.roles.has(role));
  if (!args.roles.length) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  let unassignedRoleEmojis = args.roles.some(role => !reactionRolesIDs.includes(role));
  if (unassignedRoleEmojis) {
    return Bastion.emit('error', '', 'Some roles doesn\'t have any assigned emojis. Please assign emojis to roles before you use them for reaction roles.', message.channel);
  }


  let body;
  if (args.body && args.body.length) {
    body = args.body.join(' ');
  }
  else {
    let reactionRoles = roleModels.filter(model => args.roles.includes(model.dataValues.roleID));
    reactionRoles = reactionRoles.map(model => `${decodeURIComponent(model.dataValues.emoji)} - **${message.guild.roles.get(model.dataValues.roleID).name}** / ${model.dataValues.roleID}`);
    body = reactionRoles.join('\n');
  }


  let reactionRolesMessage = await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: args.title && args.title.length ? args.title.join(' ') : 'Reaction Roles',
      description: body,
      footer: {
        text: `${args.exclusive ? 'Mutually Exclusive' : ''} Reaction Roles • React with the emoji to get the corresponding role.`
      }
    }
  });
  await reactionRolesMessage.pin().catch(() => {});


  await Bastion.database.models.reactionRolesGroup.upsert({
    messageID: reactionRolesMessage.id,
    channelID: reactionRolesMessage.channel.id,
    guildID: reactionRolesMessage.guild.id,
    reactionRoles: args.roles,
    mutuallyExclusive: args.exclusive
  },
  {
    where: {
      messageID: reactionRolesMessage.id,
      channelID: reactionRolesMessage.channel.id,
      guildID: reactionRolesMessage.guild.id
    },
    fields: [ 'messageID', 'channelID', 'guildID', 'reactionRoles', 'mutuallyExclusive' ]
  });


  let reactionRolesEmojis = roleModels.filter(model => args.roles.includes(model.dataValues.roleID)).map(model => model.dataValues.emoji);
  for (let emoji of reactionRolesEmojis) {
    await reactionRolesMessage.react(emoji);
  }
};

exports.config = {
  aliases: [ 'reactionRoles' ],
  enabled: true,
  argsDefinitions: [
    { name: 'roles', type: String, multiple: true, defaultOption: true },
    { name: 'title', type: String, alias: 't', multiple: true },
    { name: 'body', type: String, alias: 'b', multiple: true },
    { name: 'exclusive', type: Boolean, alias: 'e', defaultValue: false },
    { name: 'remove', type: String, alias: 'r' }
  ]
};

exports.help = {
  name: 'reactionRolesGroup',
  description: 'Creates a group of Reaction Roles and sends a message to which users can react to self assign roles to themselves and vice versa.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'reactionRolesGroup [ ROLE_ID_1 ROLE_ID_2 ... ] [ -t Message Title ] [ -b Message Body ] [ --exclusive ] [ --remove MESSAGE_ID ]',
  example: [ 'reactionRolesGroup', 'reactionRolesGroup 219101083619902983 2494130541574845651 -t Self Assign -b React to Get Role', 'reactionRolesGroup 219101083619902983 2494130541574845651 --exclusive' ]
};
