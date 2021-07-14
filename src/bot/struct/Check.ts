/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { muteRole as muterolschema } from "../mongoose/schemas/muterole";
import { mute_Schema as muted } from "../mongoose/schemas/mute";
import {
  MessageEmbed,
  Guild,
  GuildMember,
  TextChannel,
  Snowflake,
  Collection,
} from "discord.js";
import { Schedule_Schema as scheduledSchema } from "../mongoose/schemas/schedule";
import Bot from "../client/Client";
import { prefix as prefixes } from "../mongoose/schemas/prefix";
import { modlogs } from "../mongoose/schemas/modlogs";
import { Status_cache } from "./Discord-Status";

export class Cache {
  prefixcache = new Collection<string, string>();
  modlogscache = new Collection<string, string>();
  statuscache = Status_cache;
  client: Bot;
  constructor(client: Bot) {
    this.loadData();
    //Object.defineProperty(client, "this", Bot);
    this.client = client;
  }
  async loadData() {
    const prefix = await prefixes.find();
    const modchan = await modlogs.find();

    for (const result of prefix) {
      this.prefixcache.set(result.gId, result.prefix);
    }
    for (const result of modchan) {
      this.modlogscache.set(result.guildId, result.channelId);
    }
  }

  getModChannel(guildId: Snowflake) {
    return this.modlogscache.get(guildId);
  }
  getPrefix(guildId: Snowflake) {
    return this.prefixcache.get(guildId);
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

  async muterole(guild: Guild) {
    let mutedrole: any = "";
    const custommuterole = await muterolschema.findOne({
      guildId: guild.id,
    });
    const uhhh = await guild.roles.cache.find((r) => {
      return r.name === "Muted";
    });
    if (!uhhh) {
      mutedrole = null;
    }
    if (custommuterole) {
      const mt = await guild.roles.cache.find((r) => {
        return r.id === custommuterole?.muteRole;
      });
      if (!mt) {
        await muterolschema.findOneAndRemove({
          guildId: guild.id,
        });
      }
      mutedrole = mt;
    } else if (!custommuterole) mutedrole = uhhh;
    return mutedrole;
  }
  async checkPosts(client: Bot) {
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
  check() {
    this.checkPosts(this.client);
    this.MuteCheck(this.client);
  }
}
