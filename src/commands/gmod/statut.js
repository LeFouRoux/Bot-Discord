/*  $$\      $$\                                         
    $$$\    $$$ |                                        
    $$$$\  $$$$ | $$$$$$\  $$\   $$\  $$$$$$\  $$\   $$\ 
    $$\$$\$$ $$ | \____$$\ \$$\ $$  |$$  __$$\ $$ |  $$ |
    $$ \$$$  $$ | $$$$$$$ | \$$$$  / $$ /  $$ |$$ |  $$ |
    $$ |\$  /$$ |$$  __$$ | $$  $$<  $$ |  $$ |$$ |  $$ |
    $$ | \_/ $$ |\$$$$$$$ |$$  /\$$\ \$$$$$$  |\$$$$$$  |
    \__|     \__| \_______|\__/  \__| \______/  \______/  */

const { EMBED_COLORS, SUPPORT_SERVER, SITE, LOGO } = require("@root/config.js");
const { EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "statut",
    description: `🔗 ❱ Vous donne le statut du ${SERVEURP}.`,
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
        .setTitle(`Statut de ${SERVEURP} :`)
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(LOGO)
        .setDescription(
            `**Voici le statut de \`${SERVEURP}.\`**\n\n` +
            `**Statut:** ${STATUT} \n\n` +
            `**Serveur de Support:** [Ici](${SUPPORT_SERVER}) \n` +
            `**Site:** [Ici](${SITE})`
        );
    
    
        return interaction.followUp({ embeds: [embed] });
    }
  };
  