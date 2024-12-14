const { EMBED_COLORS, SUPPORT_SERVER, SITE, LOGO } = require("@root/config.js");
const { EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "hierarchie",
    description: "🔗 ❱ Vous donne la hiérarchie de AzuraRP.",
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
        .setTitle("Hiérarchie de Azura :")
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(LOGO)
        .setDescription(
            `**Voici la hiérarchie de \`Azura.\`**\n\n` +
            `**__Fondation__**\n\n` +
            '```1. Fondateur\n2. Co-Fondateur\n3. Directeur```\n' +
            `**__Haut-Gradé__**\n\n` +
            '```4. Gérant-Staff\n5. SuperAdmin```\n' +
            `**__Gradé__**\n\n` +
            '```6. Administrateur +\n7. Administrateur\n8. Administrateur-Test```\n' +
            `**__Equipe de Modération__**\n\n` +
            '```9. Modérateur-Sénior\n10. Modérateur\n11. Modérateur-Test```\n' +
            `**Serveur de Support:** [Ici](${SUPPORT_SERVER}) \n` +
            `**Site:** [Ici](${SITE})`
        );
    
    
        return interaction.followUp({ embeds: [embed] });
    }
  };
  