const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "anti",
  description: "🤖 ❱ Gérer divers paramètres d'automod.",
  category: "AUTOMOD",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: false,
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "ghostping <on|off>",
        description: "🤖 ❱ Détecte les mentions fantômes.",
      },
      {
        trigger: "spam <on|off>",
        description: "🤖 ❱ Activer ou désactiver la détection antispam",
      },
      {
        trigger: "massmention <on|off> [threshold]",
        description: "🤖 ❱ Activer ou désactiver la détection des mentions de masse [le seuil par défaut est de 3 mentions]",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "ghostping",
        description: "🤖 ❱ Détecte les mentions fantômes.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Etat de la configuration",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Activité",
                value: "ON",
              },
              {
                name: "Désactivé",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "spam",
        description: "🤖 ❱ Activer ou désactiver la détection antispam",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Etat de la configuration",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Activité",
                value: "ON",
              },
              {
                name: "Désactivé",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "massmention",
        description: "🤖 ❱ Activer ou désactiver la détection des mentions de masse",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Etat de la configuration",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Activité",
                value: "ON",
              },
              {
                name: "Désactivé",
                value: "OFF",
              },
            ],
          },
          {
            name: "threshold",
            description: "🤖 ❱ Seuil de configuration (la valeur par défaut est de 3 mentions)",
            required: false,
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
    if (sub == "ghostping") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Statut invalide. La valeur doit être `Activité/Désactivé`");
      response = await antiGhostPing(settings, status);
    }

    //
    else if (sub == "spam") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Statut invalide. La valeur doit être `Activité/Désactivé`");
      response = await antiSpam(settings, status);
    }

    //
    else if (sub === "massmention") {
      const status = args[1].toLowerCase();
      const threshold = args[2] || 3;
      if (!["on", "off"].includes(status)) return message.safeReply("Statut invalide. La valeur doit être `Activité/Désactivé`");
      response = await antiMassMention(settings, status, threshold);
    }

    //
    else response = "Utilisation de la commande invalide !";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;
    if (sub == "ghostping") response = await antiGhostPing(settings, interaction.options.getString("status"));
    else if (sub == "spam") response = await antiSpam(settings, interaction.options.getString("status"));
    else if (sub === "massmention") {
      response = await antiMassMention(
        settings,
        interaction.options.getString("status"),
        interaction.options.getInteger("amount")
      );
    } else response = "Utilisation de la commande invalide !";

    await interaction.followUp(response);
  },
};

async function antiGhostPing(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_ghostping = status;
  await settings.save();
  return `Configuration enregistrée ! L'Anti-Ghostping est maintenant ${status ? "Activité" : "Désactivé"}`;
}

async function antiSpam(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_spam = status;
  await settings.save();
  return `La détection antispam est maintenant ${status ? "Activité" : "Désactivé"}`;
}

async function antiMassMention(settings, input, threshold) {
  const status = input.toUpperCase() === "ON" ? true : false;
  if (!status) {
    settings.automod.anti_massmention = 0;
  } else {
    settings.automod.anti_massmention = threshold;
  }
  await settings.save();
  return `La détection des mentions en masse est maintenant ${status ? "Activité" : "Désactivé"}`;
}
