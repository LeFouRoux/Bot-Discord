const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { EMBED_COLORS, SUPPORT_SERVER, DASHBOARD } = require("@root/config");

module.exports = (client) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Invite" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription("Salut! Merci d'avoir envisagé de m'inviter\nUtilisez le bouton ci-dessous pour naviguer où vous voulez");

  // Buttons
  let components = [];
  components.push(new ButtonBuilder().setLabel("Lien d'invitation").setURL(client.getInvite()).setStyle(ButtonStyle.Link));

  if (SUPPORT_SERVER) {
    components.push(new ButtonBuilder().setLabel("Serveur d'assistance").setURL(SUPPORT_SERVER).setStyle(ButtonStyle.Link));
  }

  if (DASHBOARD.enabled) {
    components.push(
      new ButtonBuilder().setLabel("Lien vers le tableau de bord").setURL(DASHBOARD.baseURL).setStyle(ButtonStyle.Link)
    );
  }

  let buttonsRow = new ActionRowBuilder().addComponents(components);
  return { embeds: [embed], components: [buttonsRow] };
};
