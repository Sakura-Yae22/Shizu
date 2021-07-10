/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import axios from 'axios';


abstract class UrbanCommand extends Command {
		constructor() {
				super({
						name: 'urban',
						aliases: [],
						description: 'Searchs a disctionary called urban',
						usage: '<prefix>urban <search term>',
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
						let text = args.join(' ');

						text = encodeURIComponent(text);

						const {
								data: {
										list
								}
						} = await axios.get(`https://api.urbandictionary.com/v0/define?term=${text}`);
						const [answer] = list;
						const embed = new MessageEmbed()
								.setTitle(answer.word)
								.setURL(answer.permalink)
								.setColor('RANDOM')
								.addField('Definition', trim(answer.definition))
								.addField('Example', trim(answer.example))
								.addField('Ratings', `${answer.thumbs_up} 👍 && ${answer.thumbs_down} 👍`)
								.setAuthor(answer.author ? answer.author : 'None');

						message.reply({ embeds: [embed] });
				} catch (e: any) {
						if (!message.guild) {
						return message.channel.send({
							content:`${e.message}`
						});
						}
						else return this.client.logs(message, e, 'error');
				}
		}
}
export default UrbanCommand;

function trim(input: string): string {
		return input.length > 1024 ? `${input.slice(0, 1020)} ...` : input;
}
