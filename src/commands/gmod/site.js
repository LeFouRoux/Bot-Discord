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
    name: "site",
    description: "🔗 ❱ Vous donne lien du site.",
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
        .setTitle(`Site de ${SERVEURP} :`)
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(LOGO)
        .setDescription(
            `**Voici le site de \`${SERVEURP}.\`**\n\n` +
            `**[Clique ici pour accéder au site](${SITE})**\n\n` +
            `**Serveur de Support:** [Ici](${SUPPORT_SERVER}) \n` +
            `**Site:** [Ici](${SITE})`
        );
    
    
        return interaction.followUp({ embeds: [embed] });
    }
  };
  