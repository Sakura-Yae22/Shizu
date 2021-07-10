import mongoose from 'mongoose';
import { Imodlogs } from '../interfaces/schemaInterface';

const modlogsSchema = new mongoose.Schema({ // Make schema
		guildId: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true
        }
});

const modlogs = mongoose.model<Imodlogs>('modlogs', modlogsSchema);

export { modlogs };

