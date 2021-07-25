/* eslint-disable no-useless-escape */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, TextChannel } from "discord.js";
import { guild as schema } from "../../mongoose/schemas/guild";

abstract class ModLogsCommand extends Command {
  constructor() {
    super({
      name: "set-modlogs",
      aliases: [],
      description: "Set a channel for the mod logs",
      usage: "<prefix>set-modlogs <set-channel>",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: ["MANAGE_WEBHOOKS"],
    });
  }

  public async exec(message: Message, args: string[]) {
    const data = this.client.cache.getData(message.guild?.id);
    if (data && !data.modlogChannelId) {
      const cid =
        message.mentions.channels.first() ??
        message.guild?.channels.cache.get(`${BigInt(args[0])}`);
      if (!cid) {
        return message.reply(
          `Could\'nt find a channel! Please provide a valid Id`
        );
      }
      if (!(cid instanceof TextChannel)) {
        return message.reply(
          `This is not a valid channel tagged, Make sure this this is a text channel`
        );
      }
      await schema.findOneAndUpdate(
        {
          guildId: message.guild?.id,
        },
        {
          $set: {
            modLogsChannelId: cid.id,
          },
        }
      );
      data.modlogChannelId = cid.id;
      if (cid instanceof TextChannel)
        await cid.createWebhook("Shizu Logger", {
          avatar: `${this.client.user.displayAvatarURL()}`,
          reason: "Needed a Mod Logger",
        });
      message.reply({
        content: `Mod Logs channel set to ${cid}`,
      });
    } else if (data && data.modlogChannelId) {
      await schema.findOneAndUpdate(
        {
          guildId: String(message.guild?.id),
        },
        {
          $unset: {
            modLogsChannelId: "",
          },
        }
      );
      data.modlogChannelId = null;
      message.channel.send({
        content: `**Successfuly Reset the Mod Logs System on your Server!**\npls use this command again to re-setup!`,
      });
    }
  }
}
export default ModLogsCommand;
