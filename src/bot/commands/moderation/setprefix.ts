/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message } from "discord.js";
import { prefix as prefixes } from "../../mongoose/schemas/prefix";
import { prefixcache } from "../../struct/Check";

abstract class PrefixCommand extends Command {
  constructor() {
    super({
      name: "setprefix",
      aliases: ["prefix"],
      description: "Prefix for the bot",
      usage: "<prefix>prefix <set-prefix>",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: ["ADMINISTRATOR"],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: string[], prefix: string) {
    if (args.join(" ").trim() === prefix)
      return message.channel.send({
        content: `The prefix ur suggesting is still the same prefix being used in this command`,
      });
    const prefixess = args.join(" ");
    if (prefixess.length > 20)
      return message.channel.send({
        content: `Prefix is too long, Pls make sure it is smaller than 20`,
      });

    await prefixes.findOneAndUpdate(
      {
        gId: message.guild?.id as string,
      },
      {
        gId: message.guild?.id as string,
        prefix: prefixess,
      },
      {
        upsert: true,
      }
    );

    prefixcache.set(message.guild?.id, prefixess);
    await message.channel.send({
      content: `Prefix has been updated from ${prefix} to ${prefixess}`,
    });
  }
}
export default PrefixCommand;
