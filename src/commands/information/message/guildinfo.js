const guildInfo = require("../shared/guild");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "guildinfo",
  description: "👀 ❱ Affiche des informations sur le serveur",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  cooldown: 5,
  command: {
    enabled: true,
    aliases: ["serverinfo"],
  },

  async messageRun(message, args) {
    const response = await guildInfo(message.guild);
    await message.safeReply(response);
  },
};
