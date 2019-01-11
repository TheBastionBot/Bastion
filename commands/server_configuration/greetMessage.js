/**
 * @file greetMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.text && !args.embed) {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'greet', 'greetMessage' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (guildModel.dataValues.greetMessage && Object.keys(guildModel.dataValues.greetMessage).length) {
      let text = guildModel.dataValues.greetMessage.text ? guildModel.dataValues.greetMessage.text : null;
      delete guildModel.dataValues.greetMessage.text;

      let embed = Object.keys(guildModel.dataValues.greetMessage).length ? guildModel.dataValues.greetMessage : null;
      if (embed) {
        embed.footer = {};
        embed.footer.text = guildModel.dataValues.greet ? 'Greeting Message Preview' : 'Greetings are currently disabled. You can enable it using the `greet` command.';
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
              text: guildModel.dataValues.greet ? 'Greeting Message Preview' : 'Greetings are currently disabled. You can enable it using the `greet` command.'
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
          title: 'Greeting Message',
          description: `Not set. See the help message for this command to see how to set a greeting message to welcome new users: \`help ${this.help.name}\``
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
      greetMessage: responseObject
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'greetMessage' ]
    });

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Greeting Message',
        description: `Successfully set the greeting message. Use the \`${this.help.name}\` command without any arguments to see a preview of the greeting message.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'gmsg' ],
  enabled: true,
  argsDefinitions: [
    { name: 'text', type: String, alias: 't', multiple: true, defaultOption: true },
    { name: 'embed', type: String, alias: 'e', multiple: true }
  ]
};

exports.help = {
  name: 'greetMessage',
  description: 'Edits the greeting message that shows when a member joins the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetMessage [MESSAGE] [--embed EMBED_OBJECT]',
  example: [ 'greetMessage', 'greetMessage Hello {author}! Welcome to {server}.', 'greetMessage Hello {author}! --embed { "title": "{author}", "description": "Welcome to {server}." }' ]
};
