// import Bot from '../client/Client';
// import { PremiumGuild_Schema } from '../mongoose/schemas/PremiumGuildSchema'

// export default class Premium {
//     client: Bot
//     constructor(client: Bot) {
//         this.client = client;
//     }
//     makeKey(length = 25): string {
//         let result = '';
//         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//         const charactersLength = characters.length;
//         for (let i = 0; i < length; i++) {
//             result += characters.charAt(Math.floor(Math.random() * charactersLength));
//         }
//         return result;
//     }
// }