const { EmbedBuilder, escapeInlineCode, ApplicationCommandOptionType } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");
const { getInvitesLb } = require("@schemas/Member");
const { getXpLb } = require("@schemas/MemberStats");
const { getReputationLb } = require("@schemas/User");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "leaderboard",
  description: "🏅 ❱ Afficher le classement XP",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    aliases: ["lb"],
    minArgsCount: 1,
    usage: "<xp|invite|rep>",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "type",
        description: "🏅 ❱ Type de classement à afficher",
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "xp",
            value: "xp",
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0].toLowerCase();
    let response;

    if (type === "xp") response = await getXpLeaderboard(message, message.author, data.settings);
    else if (type === "invite") response = await getInviteLeaderboard(message, message.author, data.settings);
    else if (type === "rep") response = await getRepLeaderboard(message.author);
    else response = "Type de classement non valide. Choisissez soit `xp` ou `inviter`";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const type = interaction.options.getString("type");
    let response;

    if (type === "xp") response = await getXpLeaderboard(interaction, interaction.user, data.settings);
    else if (type === "invite") response = await getInviteLeaderboard(interaction, interaction.user, data.settings);
    else if (type === "rep") response = await getRepLeaderboard(interaction.user);
    else response = "Type de classement non valide. Choisissez soit `xp`";

    await interaction.followUp(response);
  },
};

async function getXpLeaderboard({ guild }, author, settings) {
  if (!settings.stats.enabled) return "Le classement est désactivé sur ce serveur";

  const lb = await getXpLb(guild.id, 10);
  if (lb.length === 0) return "Aucun utilisateur dans le classement";

  let collector = "";
  for (let i = 0; i < lb.length; i++) {
    try {
      const user = await author.client.users.fetch(lb[i].member_id);
      collector += `**#${(i + 1).toString()}** - ${escapeInlineCode(user.tag)}\n`;
    } catch (ex) {
      // Ignore
    }
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: "XP Leaderboard" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(collector)
    .setFooter({ text: `Demandé par ${author.tag}` });

  return { embeds: [embed] };
}

async function getInviteLeaderboard({ guild }, author, settings) {
  if (!settings.invite.tracking) return "Le suivi des invitations est désactivé sur ce serveur";

  const lb = await getInvitesLb(guild.id, 10);
  if (lb.length === 0) return "Aucun utilisateur dans le classement";

  let collector = "";
  for (let i = 0; i < lb.length; i++) {
    try {
      const memberId = lb[i].member_id;
      if (memberId === "VANITY") collector += `**#${(i + 1).toString()}** - Vanity URL [${lb[i].invites}]\n`;
      else {
        const user = await author.client.users.fetch(lb[i].member_id);
        collector += `**#${(i + 1).toString()}** - ${escapeInlineCode(user.tag)} [${lb[i].invites}]\n`;
      }
    } catch (ex) {
      collector += `**#${(i + 1).toString()}** - DeletedUser#0000 [${lb[i].invites}]\n`;
    }
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Invite Leaderboard" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(collector)
    .setFooter({ text: `Demandé par ${author.tag}` });

  return { embeds: [embed] };
}

async function getRepLeaderboard(author) {
  const lb = await getReputationLb(10);
  if (lb.length === 0) return "Aucun utilisateur dans le classement";

  const collector = lb
    .map((user, i) => `**#${(i + 1).toString()}** - ${escapeInlineCode(user.username)} (${user.reputation?.received})`)
    .join("\n");

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Classement de réputation" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(collector)
    .setFooter({ text: `Demandé par ${author.tag}` });

  return { embeds: [embed] };
}
