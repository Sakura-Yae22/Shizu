/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";

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
    const { channel } = message;
    const chan = channel as TextChannel;
    const user = message.member?.user;
    const number = parseInt(args[0]);
    if (!number) {
      const naw = new MessageEmbed()
        .setAuthor(
          `${this.client.user.username}`,
          `${this.client.user.displayAvatarURL({ dynamic: true })}`
        )
        .setDescription(`❎ ${user?.username}, please give me a number`)
        .setFooter(
          `Requested by: ${message.author.username}`,
          user?.displayAvatarURL()
        )
        .setTimestamp()
        .setColor(`#ff3d3d`);
      message.channel.send({
        embeds: [naw],
      });
    } else {
      if (isNaN(number)) {
        const notanumber = new MessageEmbed()
          .setAuthor(
            `${this.client.user.username}`,
            `${this.client.user.displayAvatarURL({ dynamic: true })}`
          )
          .setDescription(`❎ ${user?.username}, please give me a number`)
          .setFooter(
            `Requested by: ${message.author.username}`,
            user?.displayAvatarURL()
          )
          .setColor(`#ff3d3d`)
          .setTimestamp();
        message.channel.send({
          embeds: [notanumber],
        });
      } else {
        if (number > 100) {
          const loldont = new MessageEmbed()
            .setAuthor(
              `${this.client.user.username}`,
              `${this.client.user.displayAvatarURL({ dynamic: true })}`
            )
            .setDescription(
              `❎ ${user?.username}, please give me a number between 1-100`
            )
            .setFooter(
              `Requested by: ${message.author.username}`,
              user?.displayAvatarURL()
            )
            .setColor(`#ff3d3d`)
            .setTimestamp();
          message.channel.send({
            embeds: [loldont],
          });
        } else {
          if (number < 1) {
            const megobruhnow = new MessageEmbed()
              .setAuthor(
                `${this.client.user.username}`,
                `${this.client.user.displayAvatarURL({ dynamic: true })}`
              )
              .setDescription(
                `❎ ${user?.username}, please give me a number between 1-100`
              )
              .setFooter(
                `Requested by: ${message.author.username}`,
                user?.displayAvatarURL()
              )
              .setColor(`#ff3d3d`)
              .setTimestamp();
            message.channel.send({
              embeds: [megobruhnow],
            });
          } else {
            const awaits = await chan.bulkDelete(number);
            const done = new MessageEmbed()
              .setTitle("Success!")
              .setAuthor(
                `${this.client.user.username}`,
                `${this.client.user.displayAvatarURL({ dynamic: true })}`
              )
              .setDescription(
                `✅ ${user?.username}, I have deleted ${awaits.size} messages`
              )
              .setFooter(
                `Requested by: ${message.author.username}`,
                user?.displayAvatarURL()
              )
              .setColor(`#3cf05a`)
              .setTimestamp();
            const msg = await message.channel.send({
              embeds: [done],
            });
            this.client.setTimeout(() => {
              msg.delete();
            }, 5000);
          }
        }
      }
    }
  }
}
export default PurgeCommand;
