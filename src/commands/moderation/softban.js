const { softbanTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "softban",
  description: "💩 ❱ Softban le membre spécifié. Expulse et supprime les messages",
  category: "MODERATION",
  botPermissions: ["BanMembers"],
  userPermissions: ["KickMembers"],
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
        description: "💩 ❱ Raison du softban",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[0]}`);
    const reason = message.content.split(args[0])[1].trim();
    const response = await softban(message.member, target, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await softban(interaction.member, target, reason);
    await interaction.followUp(response);
  },
};

async function softban(issuer, target, reason) {
  const response = await softbanTarget(issuer, target, reason);
  if (typeof response === "boolean") return `${target.user.tag} est softban !`;
  if (response === "BOT_PERM") return `Je n'ai pas la permission de softban ${target.user.tag}`;
  else if (response === "MEMBER_PERM") return `Vous n'êtes pas autorisé à softban ${target.user.tag}`;
  else return `Échec du softban ${target.user.tag}`;
}
