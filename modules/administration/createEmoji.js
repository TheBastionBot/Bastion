/**
 * @file createEmoji command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }
  if (!args.url || !/^(https?:\/\/)((([a-z0-9]{1,})?(-?)+[a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9-~#%])+\/)+)?([a-z0-9_-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(args.url) || !args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    let emoji = await message.guild.createEmoji(args.url, args.name.join('_'));

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Emoji Created',
        fields: [
          {
            name: 'Emoji Name',
            value: emoji.name,
            inline: true
          },
          {
            name: 'Creator',
            value: message.author.tag,
            inline: true
          }
        ],
        thumbnail: {
          url: emoji.url
        }
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, defaultOption: true },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'createEmoji',
  botPermission: 'MANAGE_EMOJIS',
  userPermission: 'MANAGE_EMOJIS',
  usage: 'createEmoji <EmojiURL> -n <EmojiName>',
  example: [ 'createEmoji https://bastionbot.org/assets/images/bastion.png -n BastionBot' ]
};
