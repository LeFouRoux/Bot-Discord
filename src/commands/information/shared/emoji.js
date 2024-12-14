const { parseEmoji, EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

module.exports = (emoji) => {
  let custom = parseEmoji(emoji);
  if (!custom.id) return "Ceci n'est pas un emoji de guilde valide";

  let url = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif?v=1" : "png"}`;

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: "Informations sur les émojis" })
    .setDescription(
      `**Id:** ${custom.id}\n` + `**Nom:** ${custom.name}\n` + `**Animé:** ${custom.animated ? "Yes" : "No"}`
    )
    .setImage(url);

  return { embeds: [embed] };
};
