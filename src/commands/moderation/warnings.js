const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { getWarningLogs, clearWarningLogs } = require("@schemas/ModLog");
const { getMember } = require("@schemas/Member");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "warnings",
  description: "💩 ❱ Lister ou effacer les avertissements des utilisateurs",
  category: "MODERATION",
  userPermissions: ["KickMembers"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "list [member]",
        description: "💩 ❱ Lister tous les avertissements pour un utilisateur",
      },
      {
        trigger: "clear <member>",
        description: "💩 ❱ Effacer tous les avertissements d'un utilisateur",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "list",
        description: "💩 ❱ Lister tous les avertissements pour un utilisateur",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      {
        name: "clear",
        description: "💩 ❱ Effacer tous les avertissements d'un utilisateur",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args) {
    const sub = args[0]?.toLowerCase();
    let response = "";

    if (sub === "list") {
      const target = (await message.guild.resolveMember(args[1], true)) || message.member;
      if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[1]}`);
      response = await listWarnings(target, message);
    }

    //
    else if (sub === "clear") {
      const target = await message.guild.resolveMember(args[1], true);
      if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[1]}`);
      response = await clearWarnings(target, message);
    }

    // else
    else {
      response = `Sous-commande invalide ${sub}`;
    }

    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    let response = "";

    if (sub === "list") {
      const user = interaction.options.getUser("user");
      const target = (await interaction.guild.members.fetch(user.id)) || interaction.member;
      response = await listWarnings(target, interaction);
    }

    //
    else if (sub === "clear") {
      const user = interaction.options.getUser("user");
      const target = await interaction.guild.members.fetch(user.id);
      response = await clearWarnings(target, interaction);
    }

    // else
    else {
      response = `Sous-commande invalide ${sub}`;
    }

    await interaction.followUp(response);
  },
};

async function listWarnings(target, { guildId }) {
  if (!target) return "Aucun utilisateur fourni";
  if (target.user.bot) return "Les bots n'ont pas d'avertissements";

  const warnings = await getWarningLogs(guildId, target.id);
  if (!warnings.length) return `${target.user.tag} n'a pas d'avertissements`;

  const acc = warnings.map((warning, i) => `${i + 1}. ${warning.reason} [By ${warning.admin.tag}]`).join("\n");
  const embed = new EmbedBuilder({
    author: { name: `${target.user.tag} les avertissements` },
    description: acc,
  });

  return { embeds: [embed] };
}

async function clearWarnings(target, { guildId }) {
  if (!target) return "Aucun utilisateur fourni";
  if (target.user.bot) return "Les bots n'ont pas d'avertissements";

  const memberDb = await getMember(guildId, target.id);
  memberDb.warnings = 0;
  await memberDb.save();

  await clearWarningLogs(guildId, target.id);
  return `${target.user.tag} les avertissements de ont été effacés`;
}
