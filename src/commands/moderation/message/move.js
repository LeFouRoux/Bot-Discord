const { ChannelType } = require("discord.js");
const move = require("../shared/move");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "move",
  description: "💩 ❱ Déplacer le membre spécifié vers le canal vocal",
  category: "MODERATION",
  userPermissions: ["DeafenMembers"],
  botPermissions: ["DeafenMembers"],
  command: {
    enabled: true,
    usage: "<ID|@member> <channel> [reason]",
    minArgsCount: 1,
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[0]}`);

    const channels = message.guild.findMatchingChannels(args[1]);
    if (!channels.length) return message.safeReply("Aucune chaîne correspondante trouvée");
    const targetChannel = channels.pop();
    if (!targetChannel.type === ChannelType.GuildVoice && !targetChannel.type === ChannelType.GuildStageVoice) {
      return message.safeReply("Le canal cible n'est pas un canal vocal");
    }

    const reason = args.slice(2).join(" ");
    const response = await move(message, target, reason, targetChannel);
    await message.safeReply(response);
  },
};
