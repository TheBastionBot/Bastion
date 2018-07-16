/**
 * @file commandUsage event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (message, command) => {
  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      title: 'Invalid Use',
      description: `That's not how you use the \`${command.name}\` command.`,
      fields: [
        {
          name: 'Get Help',
          value: `Use the \`${message.guild.prefix[0]}help ${command.name}\` command to see usage and example of the \`${command.name}\` command.\nYou can also join **Bastion HQ** and our amazing support staff will help you out: https://discord.gg/fzx8fkt`
        }
      ]
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
