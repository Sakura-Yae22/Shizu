import mongoose from 'mongoose';
import { ISuggest } from '../interfaces/schemaInterface';

const SuggestSchema = new mongoose.Schema({ // Make schema
		guildId: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true
        }
});

const Suggest = mongoose.model<ISuggest>('suggest', SuggestSchema);

export { Suggest, ISuggest };

