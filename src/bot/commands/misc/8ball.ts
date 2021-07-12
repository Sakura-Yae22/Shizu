/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message } from "discord.js";
import fetch from "node-fetch";
// tslint:disable-next-line: class-name
abstract class ballCommand extends Command {
  constructor() {
    super({
      name: "8ball",
      aliases: [],
      description: "Ask questions to the bot",
      usage: "<prefix>8ball <search term>",
      category: "misc",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 1,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message /* args: string[]*/) {
    fetch(`https://api.monkedev.com/fun/8ball?key=${process.env.MONKE}`)
      .then((response) => response.json())
      .then((data) => {
        message.reply({
          content: String(data.answer),
          allowedMentions: {
            repliedUser: false,
          },
        });
      })
      .catch(async (e) => {
        if (!message.guild) {
          return message.channel.send({
            content: String(`${e.message}`),
          });
        } else return this.client.logs(message, e, "error");
      });
  }
}
export default ballCommand;
