const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "autodelete",
  description: "🤖 ❱ Gérer les paramètres de suppression automatique.",
  category: "AUTOMOD",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "attachments <on|off>",
        description: "🤖 ❱ Autoriser ou interdire les pièces jointes dans le message",
      },
      {
        trigger: "invites <on|off>",
        description: "🤖 ❱ Autoriser ou interdire les invitations dans le message",
      },
      {
        trigger: "links <on|off>",
        description: "🤖 ❱ Autoriser ou interdire les liens dans le message",
      },
      {
        trigger: "maxlines <number>",
        description: "🤖 ❱ Définit le nombre maximum de lignes autorisées par message [0 pour désactiver]",
      },
    ],
  },
  slashCommand: {
    enabled: false,
    ephemeral: true,
    options: [
      {
        name: "attachments",
        description: "🤖 ❱ Autoriser ou interdire les pièces jointes dans le message",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Etat de la configuration",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Autoriser",
                value: "ON",
              },
              {
                name: "interdire",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "invites",
        description: "🤖 ❱ Autoriser ou interdire les invitations discord dans le message",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Etat de la configuration",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Autoriser",
                value: "ON",
              },
              {
                name: "interdire",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "links",
        description: "🤖 ❱ Autoriser ou interdire les liens dans le message",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Configuration status",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Autoriser",
                value: "ON",
              },
              {
                name: "interdire",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "maxlines",
        description: "🤖 ❱ Définit le nombre maximum de lignes autorisées par message",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "🤖 ❱ Quantité de configuration (0 pour désactiver)",
            required: true,
            type: ApplicationCommandOptionType.Integer,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const settings = data.settings;
    const sub = args[0].toLowerCase();
    let response;

    if (sub == "attachments") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Statut invalide. La valeur doit être `Autoriser/interdire`");
      response = await antiAttachments(settings, status);
    }

    //
    else if (sub === "invites") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Statut invalide. La valeur doit être `Autoriser/interdire");
      response = await antiInvites(settings, status);
    }

    //
    else if (sub == "links") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Statut invalide. La valeur doit être `Autoriser/interdire");
      response = await antilinks(settings, status);
    }

    //
    else if (sub === "maxlines") {
      const max = args[1];
      if (isNaN(max) || Number.parseInt(max) < 1) {
        return message.safeReply("Lignes Max doit être un nombre valide supérieur à 0");
      }
      response = await maxLines(settings, max);
    }

    //
    else response = "Utilisation de la commande invalide !";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;
    let response;

    if (sub == "attachments") {
      response = await antiAttachments(settings, interaction.options.getString("status"));
    } else if (sub === "invites") response = await antiInvites(settings, interaction.options.getString("status"));
    else if (sub == "links") response = await antilinks(settings, interaction.options.getString("status"));
    else if (sub === "maxlines") response = await maxLines(settings, interaction.options.getInteger("amount"));
    else response = "Utilisation de la commande invalide !";

    await interaction.followUp(response);
  },
};

async function antiAttachments(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_attachments = status;
  await settings.save();
  return `Messages ${
    status ? "Les pièces jointes seront désormais automatiquement supprimés" : "Les pièces jointes ne seront plus filtré"
  }`;
}

async function antiInvites(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_invites = status;
  await settings.save();
  return `Messages ${
    status ? "Les invitations discord seront désormais automatiquement supprimées" : "Les invitations discord ne seront plus filtré"
  }`;
}

async function antilinks(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_links = status;
  await settings.save();
  return `Messages ${status ? "Les liens seront désormais automatiquement supprimés" : "Les liens ne sera pas filtré"}`;
}

async function maxLines(settings, input) {
  const lines = Number.parseInt(input);
  if (isNaN(lines)) return "Veuillez saisir un nombre valide";

  settings.automod.max_lines = lines;
  await settings.save();
  return `${
    input === 0
      ? "La limite de ligne maximale est désactivée"
      : `Messages plus longs que \`${input}\` lignes seront désormais automatiquement supprimées`
  }`;
}
