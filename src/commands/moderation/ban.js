const { banTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "ban",
  description: "💩 ❱ Bannit le membre spécifié",
  category: "MODERATION",
  botPermissions: ["BanMembers"],
  userPermissions: ["BanMembers"],
  command: {
    enabled: true,
    usage: "<ID|@member> [reason]",
    minArgsCount: 5,
  },
  slashCommand: {
    enabled: true,
    minArgsCount: 5,
    options: [
      {
        name: "user",
        description: "💩 ❱ Le membre cible",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "reason",
        description: "💩 ❱ Raison du ban",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const match = await message.client.resolveUsers(args[0], true);
    const target = match[0];
    if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[0]}`);
    const reason = message.content.split(args[0])[1].trim();
    const response = await ban(message.member, target, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const response = await ban(interaction.member, target, reason);
    await interaction.followUp(response);
  },
};

/**
 * @param {import('discord.js').GuildMember} issuer
 * @param {import('discord.js').User} target
 * @param {string} reason
 */
async function ban(issuer, target, reason) {
  const response = await banTarget(issuer, target, reason);
  if (typeof response === "boolean") return `${target.tag} est ban!`;
  if (response === "BOT_PERM") return `Je n'ai pas l'autorisation de ban ${target.tag}`;
  else if (response === "MEMBER_PERM") return `Vous n'êtes pas autorisé à ban ${target.tag}`;
  else return `Échec du ban ${target.tag}`;
}
