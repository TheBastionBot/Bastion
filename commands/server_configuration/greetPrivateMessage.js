/**
 * @file greetPrivateMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.text && !args.embed) {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'greetPrivate', 'greetPrivateMessage' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (guildModel.dataValues.greetPrivateMessage && Object.keys(guildModel.dataValues.greetPrivateMessage).length) {
      let text = guildModel.dataValues.greetPrivateMessage.text ? guildModel.dataValues.greetPrivateMessage.text : null;
      delete guildModel.dataValues.greetPrivateMessage.text;

      let embed = Object.keys(guildModel.dataValues.greetPrivateMessage).length ? guildModel.dataValues.greetPrivateMessage : null;
      if (embed) {
        embed.footer = {};
        embed.footer.text = guildModel.dataValues.greetPrivate ? 'Private Greeting Message Preview' : 'Private greetings are currently disabled. You can enable it using the `greetPrivate` command.';
      }

      if (text && embed) {
        await message.channel.send(text, { embed: embed });
      }
      else if (text) {
        await message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            description: text,
            footer: {
              text: guildModel.dataValues.greetPrivate ? 'Private Greeting Message Preview' : 'Private greetings are currently disabled. You can enable it using the `greetPrivate` command.'
            }
          }
        });
      }
      else if (embed) {
        await message.channel.send({ embed: embed });
      }
    }
    else {
      await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Private Greeting Message',
          description: `Not set. See the help message for this command to see how to set a private greeting message to welcome new users: \`help ${this.help.name}\``
        }
      });
    }
  }
  else {
    let responseObject = {};

    if (args.text) {
      responseObject.text = args.text.join(' ');
    }
    if (args.embed) {
      args.embed = args.embed.join(' ');
      Object.assign(responseObject, JSON.parse(args.embed));

      delete responseObject.footer;
    }

    await Bastion.database.models.guild.update({
      greetPrivateMessage: responseObject
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'greetPrivateMessage' ]
    });

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Private Greeting Message',
        description: `Successfully set the private greeting message. Use the \`${this.help.name}\` command without any arguments to see a preview of the private greeting message.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'greetprvmsg' ],
  enabled: true,
  argsDefinitions: [
    { name: 'text', type: String, alias: 't', multiple: true, defaultOption: true },
    { name: 'embed', type: String, alias: 'e', multiple: true }
  ]
};

exports.help = {
  name: 'greetPrivateMessage',
  description: 'Edits the greeting message that is sent as direct message when a member joins the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetPrivateMessage [MESSAGE] [--embed EMBED_OBJECT]',
  example: [ 'greetPrivateMessage', 'greetPrivateMessage Hello {author}! Welcome to {server}.', 'greetPrivateMessage Hello {author}! --embed { "title": "{author}", "description": "Welcome to {server}." }' ]
};
