/**
 * @file reactionRolesGroup command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.roles) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }


    let roleModels = await Bastion.database.models.role.findAll({
      attributes: [ 'roleID', 'emoji' ],
      where: {
        guildID: message.guild.id,
        emoji: {
          [Bastion.database.Op.not]: null
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
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'reactionRoles' ],
  enabled: true,
  argsDefinitions: [
    { name: 'roles', type: String, multiple: true, defaultOption: true },
    { name: 'title', type: String, alias: 't', muiltiple: true },
    { name: 'body', type: String, alias: 'b', multiple: true },
    { name: 'exclusive', type: Boolean, alias: 'e', defaultValue: false }
  ]
};

exports.help = {
  name: 'reactionRolesGroup',
  description: 'Creates a group of Reaction Roles and sends a message to which users can react to self assign roles to themselves and vice versa.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'reactionRolesGroup < ROLE_ID_1, ROLE_ID_2, ... > [ -t Message Title ] [ -b Message Body ] [ --exclusive ]',
  example: [ 'reactionRolesGroup 219101083619902983', 'reactionRolesGroup 219101083619902983 2494130541574845651 -t Self Assign -b React to Get Role', 'reactionRolesGroup 219101083619902983 2494130541574845651 --exclusive' ]
};
