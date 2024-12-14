const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "autorole",
  description: "➕ ❱ Rôle à attribuer lorsqu'un membre rejoint le serveur",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<role|off>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "add",
        description: "➕ ❱ Configurer le rôle automatique",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "role",
            description: "➕ ❱ Le rôle à donner",
            type: ApplicationCommandOptionType.Role,
            required: false,
          },
          {
            name: "role_id",
            description: "➕ ❱ L'identifiant de rôle à attribuer",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "remove",
        description: "➕ ❱ Désactiver le rôle automatique",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args.join(" ");
    let response;

    if (input.toLowerCase() === "off") {
      response = await setAutoRole(message, null, data.settings);
    } else {
      const roles = message.guild.findMatchingRoles(input);
      if (roles.length === 0) response = "Aucun rôle correspondant trouvé correspondant à votre requête";
      else response = await setAutoRole(message, roles[0], data.settings);
    }

    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    let response;

    // add
    if (sub === "add") {
      let role = interaction.options.getRole("role");
      if (!role) {
        const role_id = interaction.options.getString("role_id");
        if (!role_id) return interaction.followUp("Veuillez fournir un rôle ou un identifiant de rôle");

        const roles = interaction.guild.findMatchingRoles(role_id);
        if (roles.length === 0) return interaction.followUp("Aucun rôle correspondant trouvé correspondant à votre requête");
        role = roles[0];
      }

      response = await setAutoRole(interaction, role, data.settings);
    }

    // remove
    else if (sub === "remove") {
      response = await setAutoRole(interaction, null, data.settings);
    }

    // default
    else response = "Invalid subcommand";

    await interaction.followUp(response);
  },
};

/**
 * @param {import("discord.js").Message | import("discord.js").CommandInteraction} message
 * @param {import("discord.js").Role} role
 * @param {import("@models/Guild")} settings
 */
async function setAutoRole({ guild }, role, settings) {
  if (role) {
    if (role.id === guild.roles.everyone.id) return "Vous ne pouvez pas définir `@everyone` comme rôle automatique";
    if (!guild.members.me.permissions.has("ManageRoles")) return "Je n'ai pas l'autorisation \"Gérer les rôles\"";
    if (guild.members.me.roles.highest.position < role.position)
      return "Je n'ai pas les autorisations pour attribuer ce rôle";
    if (role.managed) return "Oops! Ce rôle est géré par une intégration";
  }

  if (!role) settings.autorole = null;
  else settings.autorole = role.id;

  await settings.save();
  return `Configuration enregistrée ! Le rôle automatique est ${!role ? "Désactivé" : "Installation"}`;
}
