// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-empty */
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import Command from '../../struct/Command';
// import { Message } from 'discord.js';
// import { PremiumGuild_Schema } from '../../mongoose/schemas/PremiumGuildSchema';

// abstract class AnischedCommand extends Command {
//     constructor() {
//         super({
//             name: 'premium',
//             aliases: [],
//             description: 'Set or remove a guil',
//             usage: '<prefix>premium <guildid>',
//             category: 'Devs',
//             cooldown: 50,
//             ownerOnly: true,
//             guildOnly: true,
//             requiredArgs: 1,
//             userPermissions: [],
//             clientPermissions: []
//         });
//     }

//     public async exec(message: Message, args: string[]) {
//         try {
//             const user = await message.guild.members.cache.get(`${BigInt(args[0])}`)
//         }
//         catch (e) {
//             return this.client.logs(message, e, 'error');
//         }
//     }
// }
// export default AnischedCommand;