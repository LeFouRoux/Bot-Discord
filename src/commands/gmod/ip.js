const { EMBED_COLORS, SUPPORT_SERVER, SITE, LOGO } = require("@root/config.js");
const { EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "ip",
    description: "🔗 ❱ Vous donne l'ip du DarkRP.",
    category: "GMOD",
    botPermissions: ["EmbedLinks"],
    command: {
      enabled: false,
    },
    slashCommand: {
      enabled: true,
      ephemeral: true,
    },
  

    async interactionRun(interaction) {
        const embed = new EmbedBuilder()
        .setTitle("IP de Azura [DarkRP] :")
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(LOGO)
        .setDescription(
            `**Voici l'ip de \`Azura [DarkRP].\`**\n\n` +
            '*Bientôt* \n\n' +
            `**Serveur de Support:** [Ici](${SUPPORT_SERVER}) \n` +
            `**Site:** [Ici](${SITE})`
        );
    
    
        return interaction.followUp({ embeds: [embed] });
    }
  };
  