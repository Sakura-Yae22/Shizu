import mongoose from 'mongoose';
import { IDiscord_Status } from '../interfaces/schemaInterface';

const DSchema = new mongoose.Schema({ // Make schema
		guildId: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true
        }
});

const DiscordStatuslogs = mongoose.model<IDiscord_Status>('discordstatus', DSchema);

export { DiscordStatuslogs };

