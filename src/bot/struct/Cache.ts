/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { guild as schema } from "../mongoose/schemas/guild";
import { mute_Schema as muted } from "../mongoose/schemas/mute";
import {
  MessageEmbed,
  Guild,
  GuildMember,
  TextChannel,
  Snowflake,
  Collection,
  Role,
} from "discord.js";
import { Schedule_Schema as scheduledSchema } from "../mongoose/schemas/schedule";
import Bot from "../client/Client";
import { Status_cache } from "./Discord-Status";

export class Cache {
  prefixcache = new Collection<string, string>();
  modlogscache = new Collection<string, string>();
  suggestcache = new Collection<string, string>();
  statuscache = Status_cache;
  client: Bot;
  constructor() {
    this.loadData();
    //Object.defineProperty(client, "this", Bot);
  }
  async loadData() {
    const data = await schema.find({});
    for (const res of data) {
      if (res.prefix) this.prefixcache.set(res.guildId, res.prefix);
      if (res.modlogChannelId)
        this.modlogscache.set(res.guildId, res.modLogsChannelId);
      if (res.suggestChannelId)
        this.suggestcache.set(res.guildId, res.suggestChannelId);
    }
  }

  getModChannel(guildId: Snowflake) {
    return this.modlogscache.get(guildId);
  }
  getPrefix(guildId: Snowflake) {
    return this.prefixcache.get(guildId);
  }

  getSuggestChannel(guildId: Snowflake) {
    return this.suggestcache.get(guildId);
  }
  async MuteCheck(client: Bot) {
    const now = new Date();

    const condtion = {
      expires: {
        $lt: now,
      },
    };
    const results = await muted.find(condtion);
    if (results && results.length) {
      for (const result of results) {
        const { guildId, userId, reason, staffTag, staffId } = result;

        const guild: Guild | undefined = client.guilds.cache.get(
          `${BigInt(guildId)}`
        );
        const member: GuildMember | undefined = guild?.members.cache.get(
          `${BigInt(userId)}`
        );
        if (!member) {
          await muted.deleteMany(condtion);
          return;
        }
        const mrole = await this.muterole(guild!);
        if (!mrole) return;
        await member.roles.remove(mrole).catch(() => {
          return;
        });
        const dm = new MessageEmbed()
          .setTitle(`You are unmuted in ${guild?.name}`)
          .setColor("GREEN")
          .setDescription(`**Reason**\n${reason}`)
          .setThumbnail(
            `https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`
          )
          .addField(`**Staff**`, `${staffTag}(${staffId})`, true);
        await member.send({ embeds: [dm] }).catch(() => {
          return;
        });
      }
      await muted.deleteMany(condtion);
    }
  }

  async muterole(guild: Guild): Promise<Role | undefined> {
    let mutedrole: Role | undefined;
    const custommuterole = await schema.findOne({
      guildId: guild.id,
      muteRoleId: { $exists: true },
    });
    const uhhh = guild.roles.cache.find((r) => {
      return r.name === "Muted";
    });
    if (custommuterole) {
      const mt = guild.roles.cache.find((r) => {
        return r.id === custommuterole?.muteRoleId;
      });
      if (!mt) {
        await schema.findOneAndUpdate(
          {
            guildId: guild.id,
            muteRoleId: { $exists: true },
          },
          {
            $unset: {
              muteRoleId: "",
            },
          }
        );
      }
      mutedrole = mt;
    } else if (!custommuterole) mutedrole = uhhh;
    return mutedrole;
  }
  async checkPosts(client: Bot): Promise<void> {
    const query = {
      date: {
        $lte: Date.now(),
      },
    };

    const results = await scheduledSchema.find(query);

    for (const post of results) {
      const { date, content, guildId, channelId } = post;

      const guild: Guild | undefined = client.guilds.cache.get(
        `${BigInt(guildId)}`
      );
      if (!guild) {
        continue;
      }

      const channel = guild.channels.cache.get(
        `${BigInt(channelId)}`
      ) as TextChannel;
      if (!channel) {
        continue;
      }
      const content_embed = new MessageEmbed()
        .setDescription(content)
        .setTimestamp(date);

      channel.send({
        embeds: [content_embed],
      });
    }
    await scheduledSchema.deleteMany(query);
  }
  check(client: Bot): void {
    this.checkPosts(client);
    this.MuteCheck(client);
  }
}
