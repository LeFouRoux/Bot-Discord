/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "quitteserveur",
  description: "🤴 ❱ Quitter un serveur.",
  category: "OWNER",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    minArgsCount: 1,
    aliases: ["qs"],
    usage: "<serverId>",
  },
  slashCommand: {
    enabled: false,
  },


  async messageRun(message, args, data) {
    const input = args[0];
    const guild = message.client.guilds.cache.get(input);
    if (!guild) {
      return message.safeReply(
        `Aucun serveur trouvé. Veuillez fournir un identifiant de serveur valide.
        Vous pouvez utiliser ${data.prefix}ls pour trouver l'identifiant du serveur`
      );
    }

    const name = guild.name;
    try {
      await guild.leave();
      return message.safeReply(`Parti avec succès \`${name}\``);
    } catch (err) {
      message.client.logger.error("GuildLeave", err);
      return message.safeReply(`Échec du départ \`${name}\``);
    }
  },
};
