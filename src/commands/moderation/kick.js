const { kickTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "kick",
  description: "💩 ❱ Expulse le membre spécifié",
  category: "MODERATION",
  botPermissions: ["KickMembers"],
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
        description: "💩 ❱ Raison du kick",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[0]}`);
    const reason = message.content.split(args[0])[1].trim();
    const response = await kick(message.member, target, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await kick(interaction.member, target, reason);
    await interaction.followUp(response);
  },
};

async function kick(issuer, target, reason) {
  const response = await kickTarget(issuer, target, reason);
  if (typeof response === "boolean") return `${target.user.tag} est kick !`;
  if (response === "BOT_PERM") return `je n'ai pas la permission de kick ${target.user.tag}`;
  else if (response === "MEMBER_PERM") return `Vous n'avez pas la permission de kick ${target.user.tag}`;
  else return `Impossible de kick ${target.user.tag}`;
}
