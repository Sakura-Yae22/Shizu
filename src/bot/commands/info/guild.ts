/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import Paginate from 'discordjs-paginate';


const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻ [HIGH]',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ [VERY_HIGH]'
};

// const regions = {
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		brazil: 'Brazil',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		europe: 'Europe',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		hongkong: 'Hong Kong',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		india: 'India',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		japan: 'Japan',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		russia: 'Russia',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		singapore: 'Singapore',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		southafrica: 'South Africa',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		sydeny: 'Sydeny',
// 		'us-central': 'US Central',
// 		'us-east': 'US East',
// 		'us-west': 'US West',
// 		'us-south': 'US South'
// };

abstract class ServerCommand extends Command {
	constructor() {
		super({
			name: 'guild',
			aliases: ['server', 'serverinfo'],
			description: 'Gives Info about the server',
			usage: '<prefix>guild',
			category: 'info',
			cooldown: 10,
			ownerOnly: false,
			guildOnly: true,
			requiredArgs: 0,
			userPermissions: [],
			clientPermissions: []
		});
	}

	public async exec(message: Message) {
		try {
			// **❯ Region:** ${regions[message.guild.]}

			const roles: any = message.guild?.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
			const members = message.guild?.members.cache;
			const channels = message.guild?.channels.cache;
			const emojis = message.guild?.emojis.cache;
			const owner = await message.guild?.fetchOwner();
			if (message.guild) {
				const embed = new MessageEmbed()
					.setDescription(`**General Info for __${message.guild.name}__**`)
					.setColor('RANDOM')
					.setThumbnail(message.guild.iconURL({
						dynamic: true
					})!)
					.addField('General', String(`
												**❯ Name:** ${message.guild.name}
												**❯ ID:** ${message.guild.id}
												**❯ Owner:** ${owner?.user.tag} (${message.guild.ownerId})
												**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}
												**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}
												**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}
												**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}
											`))
					.setTimestamp();
				const embed2 = new MessageEmbed()
					.setDescription(`**Stats for __${message.guild.name}__**`)
					.setColor('RANDOM')
					.setThumbnail(message.guild.iconURL({
						dynamic: true
					})!)
					.addField('Statistics', String(`
										**❯ Role Count:** ${roles?.length}
										**❯ Emoji Count:** ${emojis?.size}
										**❯ Regular Emoji Count:** ${emojis?.filter(emoji => !emoji.animated).size}
										**❯ Animated Emoji Count:** ${emojis?.filter(emoji => emoji.animated ?? false).size}
										**❯ Member Count:** ${message.guild.memberCount}
										**❯ Humans:** ${members?.filter(member => !member.user.bot).size}
										**❯ Bots:** ${members?.filter(member => member.user.bot).size}
										**❯ Text Channels:** ${channels?.filter(channel => channel.type === 'GUILD_TEXT').size}
										**❯ Voice Channels:** ${channels?.filter(channel => channel.type === 'GUILD_VOICE').size}
										**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`), true)
					.setTimestamp();
				const embed3 = new MessageEmbed()
					.setDescription(`**Precence info for __${message.guild.name}__**`)
					.setColor('RANDOM')
					.setThumbnail(message.guild.iconURL({
						dynamic: true
					})!).setTimestamp()
					.addField('Presence', String(`
												**❯ Online:** ${members?.filter(member => member.presence?.status === 'online').size}
												**❯ Idle:** ${members?.filter(member => member.presence?.status === 'idle').size}
												**❯ Do Not Disturb:** ${members?.filter(member => member.presence?.status === 'dnd').size}
												**❯ Offline:** ${members?.filter(member => member.presence?.status === 'offline').size}
										`), true);

				const embed4 = new MessageEmbed()
					.setDescription(`**Role information for __${message.guild.name}__**`)
					.setColor('RANDOM')
					.setThumbnail(message.guild.iconURL({
						dynamic: true
					})!)
					.addField(`Roles [${roles.length - 1}]`, String(roles.length < 20 ? roles.join(', ') : roles.length > 20 ? await trimArray(roles) : 'None'))
					.setTimestamp();
				const arrr = [embed, embed2, embed3, embed4];
				const embeds = new Paginate(arrr, message, {
					appendPageInfo: true,
					timeout: 60000,
					previousbtn: '841961355799691264',
					nextbtn: '841961438884003870',
					stopbtn: '841962179490349068',
					// removeUserReactions: message.channel.type !== 'dm'
					removeUserReactions: false,
					removeAllReactions: false
				});
				await embeds.exec();
			}
		} catch (e) {
			return this.client.logs(message, e, 'error');
		}
	}
}
export default ServerCommand;

async function trimArray(arr: string[], maxLen = 20) {
	if (arr.length > maxLen) {
		const len = arr.length - maxLen;
		arr = arr.slice(0, maxLen);
		arr.push(`${len} more roles...`);
	}
	return arr;
}