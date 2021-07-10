/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

abstract class ReverseCommand extends Command {
	constructor() {
		super({
			name: 'reverse',
			aliases: [],
			description: 'Reverse text : )',
			usage: '<prefix>reverse <term>',
			category: 'misc',
			cooldown: 10,
			ownerOnly: false,
			guildOnly: false,
			requiredArgs: 1,
			userPermissions: [],
			clientPermissions: []
		});
	}

	// tslint:disable-next-line: promise-function-async
	public async exec(message: Message, args: string[]) {
		const text = args.join(' ');
		fetch(`https://api.monkedev.com/fun/reverse?content=${encodeURIComponent(text)}&key=${this.client.secret.MONKE}`)
			.then(response => response.json()).then(data => {
				message.reply({
					content: String(data.result),
					allowedMentions: {
						repliedUser: false
					}
				});
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
export default ReverseCommand;
