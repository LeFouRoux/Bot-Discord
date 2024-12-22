/*  $$\      $$\                                         
    $$$\    $$$ |                                        
    $$$$\  $$$$ | $$$$$$\  $$\   $$\  $$$$$$\  $$\   $$\ 
    $$\$$\$$ $$ | \____$$\ \$$\ $$  |$$  __$$\ $$ |  $$ |
    $$ \$$$  $$ | $$$$$$$ | \$$$$  / $$ /  $$ |$$ |  $$ |
    $$ |\$  /$$ |$$  __$$ | $$  $$<  $$ |  $$ |$$ |  $$ |
    $$ | \_/ $$ |\$$$$$$$ |$$  /\$$\ \$$$$$$  |\$$$$$$  |
    \__|     \__| \_______|\__/  \__| \______/  \______/  */

const { EMBED_COLORS, SUPPORT_SERVER, SITE, LOGO, FDO, Regle, IPSERV } = require("@root/config.js");
const { EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "liens",
    description: `🔗 ❱ Vous donne les liens utile de ${SERVEURP}.`,
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
        .setTitle(`Les liens utile de ${SERVEURP} :`)
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(LOGO)
        .setDescription(
            `**Voici les liens utile de \`${SERVEURP}.\`**\n\n` +
            `<:72081owner:1275790153582903296> **》Discord :** __[Ici](${SUPPORT_SERVER})__ \n` +
            `<:72081owner:1275790153582903296> **》Discord Force de l'ordre :** __[Ici](${FDO})__ \n` +
            `<:94919trialmod:1275790090773204992> **》Règlement :** __[Ici](${Regle})__ \n` +
            `<:86332viral:1275790128501231626> **》Boutique :** __[Ici](${BOUTIQUE})__ \n` +
            `<:54538booster:1275790003011846204> **》Top Serveur :** __[Ici](${TOPSERV})__ \n` +
            `<:Logo:1278829031197900800> **》Collection :** __[Ici](${COLLEC})__ \n` +
            `<:11987editor:1275790145915977870> **》IP Serveur :** __*${IPSERV}*__ \n\n` +
            `**Serveur de Support:** [Ici](${SUPPORT_SERVER}) \n` +
            `**Site:** [Ici](${SITE})`
        );
    
    
        return interaction.followUp({ embeds: [embed] });
    }
  };
  