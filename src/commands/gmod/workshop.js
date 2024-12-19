const { EMBED_COLORS, SUPPORT_SERVER, SITE, LOGO, COLLEC } = require("@root/config.js");
const { EmbedBuilder } = require("discord.js");


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "workshop",
    description: `🔗 ❱ Vous donne le workshop de ${SERVEURP}`,
    category: "GMOD",
    command: {
      enabled: false,
    },
    slashCommand: {
      enabled: true,
      ephemeral: true,
      options: [],
    },

  
    async interactionRun(interaction) {
      const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setThumbnail(LOGO)
      .setTitle(`Voici le workshop de ${SERVEURP} :`)
      .setDescription(
          `**Workshop :**\n` +
          `${COLLEC} \n\n` +
          `**Serveur de Support:** [Ici](${SUPPORT_SERVER}) \n` +
          `**Site:** [Ici](${SITE})`
      );
  
      return interaction.followUp({ embeds: [embed] });
    },
  };
  