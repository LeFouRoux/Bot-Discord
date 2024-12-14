const { EMBED_COLORS, SUPPORT_SERVER, SITE, LOGO } = require("@root/config.js");
const { EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "liens",
    description: "🔗 ❱ Vous donne les liens utile de Azura.",
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
        .setTitle("Les liens utile de Azura :")
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(LOGO)
        .setDescription(
            `**Voici les liens utile de \`Azura.\`**\n\n` +
            `<:72081owner:1275790153582903296> **》Discord :** __[Ici](https://discord.gg/yKrK3yQeZ8)__ \n` +
            `<:72081owner:1275790153582903296> **》Discord Force de l'ordre :** __[Ici](https://discord.gg/pqNGna6Vfr)__ \n` +
            `<a:bydiscord:1281882574419136574> **》Discord Centre d'aide :** __[Ici](https://discord.gg/8AbnbCBb77)__ \n` +
            `<:52175partner:1275790131105759252> **》Discord MilitaryRP :** __[Ici](https://discord.gg/GZvYnFWQCs)__ \n` +
            `<:94919trialmod:1275790090773204992> **》Règlement :** __[Ici](https://sites.google.com/view/azurarp/)__ \n` +
            /*`<:86332viral:1275790128501231626> **》Boutique :** __[Ici](Non Dispo)__ \n` +*/
            `<:54538booster:1275790003011846204> **》Top Serveur :** __[Ici](https://top-serveurs.net/garrys-mod/vote/azurarp)__ \n` +
            `<:Logo:1278829031197900800> **》Collection :** __[Ici](https://steamcommunity.com/sharedfiles/filedetails/?id=3314797630)__ \n` +
            `<:11987editor:1275790145915977870> **》IP Serveur :** __*Bientôt*__ \n\n` +
            `**Serveur de Support:** [Ici](${SUPPORT_SERVER}) \n` +
            `**Site:** [Ici](${SITE})`
        );
    
    
        return interaction.followUp({ embeds: [embed] });
    }
  };
  