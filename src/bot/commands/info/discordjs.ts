/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message } from 'discord.js';
import axios from 'axios';


abstract class DiscordJsCommand extends Command {
		constructor() {
				super({
						name: 'discordjs',
						aliases: ['djs', 'd.js'],
						description: 'Searches from the discordJs docs',
						usage: '<prefix>djs <search term>',
						category: 'info',
						cooldown: 2,
						ownerOnly: false,
						guildOnly: false,
						requiredArgs: 1,
						userPermissions: [],
						clientPermissions: []
				});
		}

		public async exec(message: Message, args: string[]) {
				try {
						const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(' '))}`;
						axios
								.get(uri)
								.then((embed) => {
										const {
												data
										} = embed;
										if (data && !data.error) {
												message.channel.send({
														embeds: [data]
												});
										} else {
												message.reply({ 
													content: 'Could not find that documentation'
												});
										}
								});
				} catch (e) {
						if (!message.guild) {
								return message.channel.send({
									content: `${e.message}`
								});
						}
						else return this.client.logs(message, e, 'error');
				}
		}
}
export default DiscordJsCommand;

