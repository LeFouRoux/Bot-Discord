const { timeoutTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType } = require("discord.js");
const ems = require("enhanced-ms");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "timeout",
  description: "💩 ❱ Timeout le membre spécifié",
  category: "MODERATION",
  botPermissions: ["ModerateMembers"],
  userPermissions: ["ModerateMembers"],
  command: {
    enabled: true,
    aliases: ["mute"],
    usage: "<ID|@member> <duration> [reason]",
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
        name: "duration",
        description: "💩 ❱ Le temps de temporiser le membre",
        type: ApplicationCommandOptionType.String,
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

    // parse time
    const ms = ems(args[1]);
    if (!ms) return message.safeReply("Veuillez fournir une durée valide. Exemple: 1d/1h/1m/1s");

    const reason = args.slice(2).join(" ").trim();
    const response = await timeout(message.member, target, ms, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");

    // parse time
    const duration = interaction.options.getString("duration");
    const ms = ems(duration);
    if (!ms) return interaction.followUp("Veuillez fournir une durée valide. Exemple: 1d/1h/1m/1s");

    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await timeout(interaction.member, target, ms, reason);
    await interaction.followUp(response);
  },
};

async function timeout(issuer, target, ms, reason) {
  if (isNaN(ms)) return "Veuillez fournir une durée valide. Exemple: 1d/1h/1m/1s";
  const response = await timeoutTarget(issuer, target, ms, reason);
  if (typeof response === "boolean") return `${target.user.tag} est timeout !`;
  if (response === "BOT_PERM") return `je n'ai pas l'autorisation de timeout ${target.user.tag}`;
  else if (response === "MEMBER_PERM") return `Vous n'avez pas l'autorisation de timeout ${target.user.tag}`;
  else if (response === "ALREADY_TIMEOUT") return `${target.user.tag} est déjà timed out!`;
  else return `Impossible de timeout ${target.user.tag}`;
}
