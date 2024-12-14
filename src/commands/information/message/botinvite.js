const botinvite = require("../shared/botinvite");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "botinvite",
  description: "👀 ❱ Vous donne une invitation de bot",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: false,
  },

  async messageRun(message, args) {
    const response = botinvite(message.client);
    try {
      await message.author.send(response);
      return message.safeReply("Vérifiez votre DM pour mes informations ! :envelope_with_arrow:");
    } catch (ex) {
      return message.safeReply("Je ne peux pas vous envoyer mes informations ! Votre DM est-il ouvert ?");
    }
  },
};
