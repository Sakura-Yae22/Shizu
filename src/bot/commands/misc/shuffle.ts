/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message } from "discord.js";
import fetch from "node-fetch";

abstract class ShuffleCommand extends Command {
  constructor() {
    super({
      name: "shuffle",
      aliases: [],
      description: "Shuffle text : )",
      usage: "<prefix>shuffle <term>",
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
  public async exec(message: Message, args: string[]) {
    const text: string = args.join(" ");
    fetch(
      `https://api.monkedev.com/fun/shuffle?content=${encodeURIComponent(
        text
      )}&key=${process.env.MONKE}`
    )
      .then((response) => response.json())
      .then((data) => {
        message.reply({
          content: String(data.result),
          allowedMentions: {
            repliedUser: false,
          },
        });
      })
      .catch(async (e) => {
        if (!message.guild) {
          return message.channel.send({
            content: `${e.message}`,
          });
        } else return this.client.logs(message, e, "error");
      });
  }
}
export default ShuffleCommand;
