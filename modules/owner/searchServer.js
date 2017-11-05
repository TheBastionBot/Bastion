/**
 * @file searchServer command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let guilds = Bastion.guilds.filter(g => g.name.toLowerCase().includes(args.join(' ').toLowerCase())).map(g => `${g.name} - ${g.id}`);
  let total = guilds.length;
  guilds = total > 0 ? guilds.slice(0, 10).join('\n') : 'None';

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Server search',
      description: `Found **${total}** servers${Bastion.shard ? `, in Shard ${Bastion.shard.id},` : ''} with **${args.join(' ')}** in it's name.`,
      fields: [
        {
          name: 'Servers',
          value: total > 10 ? `and ${total - 10} more.` : guilds
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'servers' ],
  enabled: true
};

exports.help = {
  name: 'searchServer',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'searchServer <name>',
  example: [ 'searchServer Bastion' ]
};
