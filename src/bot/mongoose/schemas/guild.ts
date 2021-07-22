import mongoose from "mongoose";

const schema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  statusChannelId: {
    type: String,
  },
  modLogsChannelId: {
    type: String,
  },
  muteRoleId: {
    type: String,
  },
  prefix: {
    type: String,
  },
  suggestChannelId: {
    type: String,
  },
});

const guild = mongoose.model("guild", schema);

export { guild };
