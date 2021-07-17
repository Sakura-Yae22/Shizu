/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Collection, Message, MessageEmbed, TextChannel } from "discord.js";

abstract class PurgeCommand extends Command {
  constructor() {
    super({
      name: "purge",
      aliases: ["clear"],
      description: "Purge Messages",
      usage: "<prefix>purge <number>",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: ["MANAGE_MESSAGES"],
      clientPermissions: ["MANAGE_MESSAGES"],
    });
  }

  public async exec(message: Message, args: string[]) {
    const qty = Math.round(Number(args[0]));
    let messages: [] = [];
    const embed = new MessageEmbed();
    if (isNaN(qty) || qty < 1) {
      return message.reply({
        embeds: [
          embed
            .setColor("RED")
            .setDescription(
              `You have specified a invalid arg which is not a number`
            ),
        ],
      });
    }
    let value;
    const amounts = Array.from(
      { length: Math.floor(qty / 99) },
      () => 99
    ).concat([qty % 99]);

    // eslint-disable-next-line no-cond-assign
    while ((value = amounts.splice(0, 1)[0])) {
      const deleted = await (message.channel as TextChannel).bulkDelete(
        value,
        true
      );
      messages = messages.concat(deleted);
      if (value > deleted.size) {
        amounts.length = 0;
      }
    }
    const size = messages.length;

    message.channel.send({
      content: String(size),
    });
  }
}
export default PurgeCommand;
