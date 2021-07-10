/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

abstract class ChatCommand extends Command {
	constructor() {
		super({
			name: 'chat',
			aliases: [],
			description: 'Chat with the bot through monke dev',
			usage: '<prefix>chat <search term>',
			category: 'misc',
			cooldown: 2,
			ownerOnly: false,
			guildOnly: false,
			requiredArgs: 1,
			userPermissions: [],
			clientPermissions: []
		});
	}

	// tslint:disable-next-line: promise-function-async
	public async exec(message: Message, args: string[], prefix: string) {
		const text = args.join(' ');
		fetch(`https://aria-api.up.railway.app/misc/chat?msg=${encodeURIComponent(text)}&uid=${message.author.id}`, {
			headers: {
				'auth': process.env.CHAT ?? 'NULL'
			}
		})
			.then(response => response.json()).then(data => {
				const embed = new MessageEmbed().setDescription(`${data.message}`).setFooter(`Api of Shizu \`${prefix}gen\``);
				message.reply({
					embeds: [embed]
				})
			}).catch(async (e) => {
				if (!message.guild) {
					return message.channel.send({
						content: `${e.message}`
					});
				}
				else return this.client.logs(message, e, 'error');
			});
	}
}
export default ChatCommand;
