/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
import { muteRole as muterolschema } from '../mongoose/schemas/muterole';
import { mute_Schema as muted } from '../mongoose/schemas/mute';
import { MessageEmbed, Guild, GuildMember, TextChannel, Snowflake } from 'discord.js';
import { Schedule_Schema as scheduledSchema } from '../mongoose/schemas/schedule';
import Bot from '../client/Client';
import { prefix as prefixes } from '../mongoose/schemas/prefix';
import { modlogs } from '../mongoose/schemas/modlogs';


const MuteCheck: Function = async (client: Bot) => {
  const now = new Date()

  const condtion = {
    expires: {
      $lt: now
    }
  }
  const results = await muted.find(condtion)
  if (results && results.length) {
    for (const result of results) {
      const {
        guildId,
        userId,
        reason,
        staffTag,
        staffId
      } = result

      const guild: Guild | undefined = await client.guilds.cache.get(`${BigInt(guildId)}`)
      const member: GuildMember | undefined = await guild?.members.cache.get(`${BigInt(userId)}`)
      if (!member) {
        await muted.deleteMany(condtion)
        return
      }
      const mrole = await muterole(guild!)
      if (!mrole) return;
      await member.roles.remove(mrole).catch(() => {
        return;
      })
      const dm = new MessageEmbed()
        .setTitle(`You are unmuted in ${guild?.name}`)
        .setColor('GREEN')
        .setDescription(`**Reason**\n${reason}`)
        .setThumbnail(`https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`)
        .addField(`**Staff**`, `${staffTag}(${staffId})`, true)
      await member.send({ embeds: [dm] }).catch(() => {
        return
      })
    }
    await muted.deleteMany(condtion)
  }
}
const checkForPosts = async (client: Bot) => {
  const query = {
    date: {
      $lte: Date.now(),
    },
  }

  const results = await scheduledSchema.find(query)

  for (const post of results) {
    const {
      date,
      content,
      guildId,
      channelId,
    } = post

    const guild: Guild | undefined = client.guilds.cache.get(`${BigInt(guildId)}`)
    if (!guild) {
      continue
    }

    const channel = guild.channels.cache.get(`${BigInt(channelId)}`) as TextChannel
    if (!channel) {
      continue
    }
    const content_embed = new MessageEmbed()
      .setDescription(content)
      .setTimestamp(date)

    channel.send({
      embeds: [content_embed]
    })
  }

  await scheduledSchema.deleteMany(query)

}


async function muterole(guild: Guild) {
  let mutedrole: any = ''
  const custommuterole = await muterolschema.findOne({
    guildId: guild.id
  })
  const uhhh = await guild.roles.cache.find(r => {
    return r.name === 'Muted'
  })
  if (!uhhh) {
    mutedrole = null
  }
  if (custommuterole) {
    const mt = await guild.roles.cache.find(r => {
      return r.id === custommuterole?.muteRole
    })
    if (!mt) {
      await muterolschema.findOneAndRemove({
        guildId: guild.id
      })
    }
    mutedrole = mt
  } else if (!custommuterole) mutedrole = uhhh
  return mutedrole
}
const prefixcache = new Map();
const ModLogsCache = new Map();
const PremiumGuildCache = new Map();

const loadData = async () => {
  const prefix = await prefixes.find()
  const modchan = await modlogs.find()

  for (const result of prefix) {
    prefixcache.set(result.gId, result.prefix)
  }
  for (const result of modchan) {
    ModLogsCache.set(result.guildId, result.channelId)
  }
}

const getPrefix = (guildId: Snowflake) => {
  return prefixcache.get(guildId)
}

const getGuild = (guildId: Snowflake) => {
  return PremiumGuildCache.get(guildId)
}
const getModChannel = (guildId: Snowflake) => {
  return ModLogsCache.get(guildId)
}
const Check = async (client: Bot) => {
  await MuteCheck(client)
  await checkForPosts(client)
}

const Cache = async () => {
  await loadData()
}

export { Check, getPrefix, prefixcache, ModLogsCache, getModChannel, Cache, getGuild, PremiumGuildCache };