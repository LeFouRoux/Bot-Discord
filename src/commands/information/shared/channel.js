const { EmbedBuilder, ChannelType } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");
const { stripIndent } = require("common-tags");
const channelTypes = require("@helpers/channelTypes");

/**
 * @param {import('discord.js').GuildChannel} channel
 */
module.exports = (channel) => {
  const { id, name, parent, position, type } = channel;

  let desc = stripIndent`
      ❯ ID: **${id}**
      ❯ Nom: **${name}**
      ❯ Type: **${channelTypes(channel.type)}**
      ❯ Catégorie: **${parent || "NA"}**\n
      `;

  if (type === ChannelType.GuildText) {
    const { rateLimitPerUser, nsfw } = channel;
    desc += stripIndent`
      ❯ Sujet: **${channel.topic || "Aucun sujet défini"}**
      ❯ Position: **${position}**
      ❯ Slowmode: **${rateLimitPerUser}**
      ❯ NSFW: **${nsfw ? "✓" : "✕"}**\n
      `;
  }

  if (type === ChannelType.GuildPublicThread || type === ChannelType.GuildPrivateThread) {
    const { ownerId, archived, locked } = channel;
    desc += stripIndent`
      ❯ Identifiant du propriétaire: **${ownerId}**
      ❯ Est archivé: **${archived ? "✓" : "✕"}**
      ❯ Est verrouillé: **${locked ? "✓" : "✕"}**\n
      `;
  }

  if (type === ChannelType.GuildNews || type === ChannelType.GuildNewsThread) {
    const { nsfw } = channel;
    desc += stripIndent`
      ❯ NSFW: **${nsfw ? "✓" : "✕"}**\n
      `;
  }

  if (type === ChannelType.GuildVoice || type === ChannelType.GuildStageVoice) {
    const { bitrate, userLimit, full } = channel;
    desc += stripIndent`
      ❯ Position: **${position}**
      ❯ Débit: **${bitrate}**
      ❯ Limite d'utilisateurs: **${userLimit}**
      ❯ Full: **${full ? "✓" : "✕"}**\n
      `;
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Détails de la chaîne" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(desc);

  return { embeds: [embed] };
};
