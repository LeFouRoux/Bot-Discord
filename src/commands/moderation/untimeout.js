const { unTimeoutTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "untimeout",
  description: "💩 ❱ Supprimer le timeout d'un membre",
  category: "MODERATION",
  botPermissions: ["ModerateMembers"],
  userPermissions: ["ModerateMembers"],
  command: {
    enabled: true,
    aliases: ["unmute"],
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
        description: "💩 ❱ Raison du délai d'attente",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[0]}`);
    const reason = args.slice(1).join(" ").trim();
    const response = await untimeout(message.member, target, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await untimeout(interaction.member, target, reason);
    await interaction.followUp(response);
  },
};

async function untimeout(issuer, target, reason) {
  const response = await unTimeoutTarget(issuer, target, reason);
  if (typeof response === "boolean") return `Délai d'attente de ${target.user.tag} est retiré!`;
  if (response === "BOT_PERM") return `Je n'ai pas la permission de supprimer le délai d'attente de ${target.user.tag}`;
  else if (response === "MEMBER_PERM") return `Vous n'êtes pas autorisé à supprimer le délai d'expiration de ${target.user.tag}`;
  else if (response === "NO_TIMEOUT") return `${target.user.tag} n'est pas timeout !`;
  else return `Impossible de supprimer le délai d'expiration de ${target.user.tag}`;
}
