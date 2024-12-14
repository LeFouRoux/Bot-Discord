const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require("discord.js");
const { EMBED_COLORS } = require("@root/config.js");
const { stripIndent } = require("common-tags");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "automod",
  description: "🤖 ❱ Diverses configurations d'automod",
  category: "AUTOMOD",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "status",
        description: "🤖 ❱ Vérifier la configuration automod pour cette guilde",
      },
      {
        trigger: "strikes <number>",
        description: "🤖 ❱ Nombre maximum d'avertissements qu'un membre peut recevoir avant d'effectuer une action",
      },
      {
        trigger: "action <TIMEOUT|KICK|BAN>",
        description: "🤖 ❱ Définir l'action à effectuer après avoir reçu le maximum d'avertissements",
      },
      {
        trigger: "debug <on|off>",
        description: "🤖 ❱ Active l'automod pour les messages envoyés par les administrateurs et les modérateurs",
      },
      {
        trigger: "whitelist",
        description: "🤖 ❱ Liste des salons qui sont sur la liste blanche",
      },
      {
        trigger: "whitelistadd <channel>",
        description: "🤖 ❱ Ajouter un salon à la liste blanche",
      },
      {
        trigger: "whitelistremove <channel>",
        description: "🤖 ❱ Supprimer un salon de la liste blanche",
      },
    ],
  },
  slashCommand: {
    enabled: false,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "🤖 ❱ Vérifier la configuration de l'automod",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "strikes",
        description: "🤖 ❱ Définir un nombre maximum d'avertissements avant d'effectuer une action",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "🤖 ❱ Nombre d'avertissements (par défaut 5)",
            required: true,
            type: ApplicationCommandOptionType.Integer,
          },
        ],
      },
      {
        name: "action",
        description: "🤖 ❱ Définir l'action à effectuer après avoir reçu le maximum d'avertissements",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "action",
            description: "🤖 ❱ Action à effectuer",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              {
                name: "TIMEOUT",
                value: "TIMEOUT",
              },
              {
                name: "KICK",
                value: "KICK",
              },
              {
                name: "BAN",
                value: "BAN",
              },
            ],
          },
        ],
      },
      {
        name: "debug",
        description: "🤖 ❱ Activer/désactiver l'automod pour les messages envoyés par les administrateurs et les modérateurs",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Etat de la configuration",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Activé",
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
        name: "whitelist",
        description: "🤖 ❱ Afficher les salons en liste blanche",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "whitelistadd",
        description: "🤖 ❱ Ajouter un salon à la liste blanche",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "🤖 ❱ Salon à ajouter",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
          },
        ],
      },
      {
        name: "whitelistremove",
        description: "🤖 ❱ Supprimer un salon de la liste blanche",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "🤖 ❱ Salon à supprimer",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    const settings = data.settings;

    let response;
    if (input === "status") {
      response = await getStatus(settings, message.guild);
    } else if (input === "strikes") {
      const strikes = args[1];
      if (isNaN(strikes) || Number.parseInt(strikes) < 1) {
        return message.safeReply("Les avertissements doivent être un nombre valide supérieur à 0");
      }
      response = await setStrikes(settings, strikes);
    } else if (input === "action") {
      const action = args[1].toUpperCase();
      if (!action || !["TIMEOUT", "KICK", "BAN"].includes(action))
        return message.safeReply("Pas une action valide. L'action peut être `Timeout`/`Kick`/`Ban`");
      response = await setAction(settings, message.guild, action);
    } else if (input === "debug") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Statut invalide. La valeur doit être `Activé/Désactivé`");
      response = await setDebug(settings, status);
    }

    // whitelist
    else if (input === "whitelist") {
      response = getWhitelist(message.guild, settings);
    }

    // whitelist add
    else if (input === "whitelistadd") {
      const match = message.guild.findMatchingChannels(args[1]);
      if (!match.length) return message.safeReply(`Aucune chaîne trouvée correspondant ${args[1]}`);
      response = await whiteListAdd(settings, match[0].id);
    }

    // whitelist remove
    else if (input === "whitelistremove") {
      const match = message.guild.findMatchingChannels(args[1]);
      if (!match.length) return message.safeReply(`Aucune chaîne trouvée correspondant ${args[1]}`);
      response = await whiteListRemove(settings, match[0].id);
    }

    //
    else response = "Invalid command usage!";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;

    if (sub === "status") response = await getStatus(settings, interaction.guild);
    else if (sub === "strikes") response = await setStrikes(settings, interaction.options.getInteger("amount"));
    else if (sub === "action")
      response = await setAction(settings, interaction.guild, interaction.options.getString("action"));
    else if (sub === "debug") response = await setDebug(settings, interaction.options.getString("status"));
    else if (sub === "whitelist") {
      response = getWhitelist(interaction.guild, settings);
    } else if (sub === "whitelistadd") {
      const channelId = interaction.options.getChannel("channel").id;
      response = await whiteListAdd(settings, channelId);
    } else if (sub === "whitelistremove") {
      const channelId = interaction.options.getChannel("channel").id;
      response = await whiteListRemove(settings, channelId);
    }

    await interaction.followUp(response);
  },
};

async function getStatus(settings, guild) {
  const { automod } = settings;

  const logChannel = settings.modlog_channel
    ? guild.channels.cache.get(settings.modlog_channel).toString()
    : "Pas configuré";

  // String Builder
  let desc = stripIndent`
    ❯ **Lignes maximales**: ${automod.max_lines || "NA"}
    ❯ **Anti-Massmention**: ${automod.anti_massmention > 0 ? "<:online:1078284891713708112>" : "<:offline:1078284803847241748>"}
    ❯ **Anti-Attachement**: ${automod.anti_attachment ? "<:online:1078284891713708112>" : "<:offline:1078284803847241748>"}
    ❯ **Anti-Liens**: ${automod.anti_links ? "<:online:1078284891713708112>" : "<:offline:1078284803847241748>"}
    ❯ **Anti-Invites**: ${automod.anti_invites ? "<:online:1078284891713708112>" : "<:offline:1078284803847241748>"}
    ❯ **Anti-Spam**: ${automod.anti_spam ? "<:online:1078284891713708112>" : "<:offline:1078284803847241748>"}
    ❯ **Anti-Ghostping**: ${automod.anti_ghostping ? "<:online:1078284891713708112>" : "<:offline:1078284803847241748>"}
  `;

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Configuration automatique", iconURL: guild.iconURL() })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(desc)
    .addFields(
      {
        name: "Salon de logs",
        value: logChannel,
        inline: true,
      },
      {
        name: "Avertisement maximales",
        value: automod.strikes.toString(),
        inline: true,
      },
      {
        name: "Action",
        value: automod.action,
        inline: true,
      },
      {
        name: "Debug",
        value: automod.debug ? "✓" : "✕",
        inline: true,
      }
    );

  return { embeds: [embed] };
}

async function setStrikes(settings, strikes) {
  settings.automod.strikes = strikes;
  await settings.save();
  return `Configuration enregistrée ! Le nombre maximal d'avertissements est défini sur ${strikes}`;
}

async function setAction(settings, guild, action) {
  if (action === "TIMEOUT") {
    if (!guild.members.me.permissions.has("ModerateMembers")) {
      return "Je n'ai pas la permission de timeout des membres";
    }
  }

  if (action === "KICK") {
    if (!guild.members.me.permissions.has("KickMembers")) {
      return "Je n'ai pas la permission d'expulser des membres";
    }
  }

  if (action === "BAN") {
    if (!guild.members.me.permissions.has("BanMembers")) {
      return "Je n'ai pas la permission d'exclure des membres";
    }
  }

  settings.automod.action = action;
  await settings.save();
  return `Configuration enregistrée ! L'action Automod est définie sur ${action}`;
}

async function setDebug(settings, input) {
  const status = input.toLowerCase() === "on" ? true : false;
  settings.automod.debug = status;
  await settings.save();
  return `Configuration enregistrée ! Le débogage d'Automod est maintenant ${status ? "Activé" : "Désactivé"}`;
}

function getWhitelist(guild, settings) {
  const whitelist = settings.automod.wh_channels;
  if (!whitelist || !whitelist.length) return "Aucune chaîne n'est sur liste blanche";

  const channels = [];
  for (const channelId of whitelist) {
    const channel = guild.channels.cache.get(channelId);
    if (!channel) continue;
    if (channel) channels.push(channel.toString());
  }

  return `Salons sur liste blanche : ${channels.join(", ")}`;
}

async function whiteListAdd(settings, channelId) {
  if (settings.automod.wh_channels.includes(channelId)) return "Le salon est déjà sur liste blanche";
  settings.automod.wh_channels.push(channelId);
  await settings.save();
  return `Salon sur liste blanche !`;
}

async function whiteListRemove(settings, channelId) {
  if (!settings.automod.wh_channels.includes(channelId)) return "Le salon n'est pas sur la liste blanche";
  settings.automod.wh_channels.splice(settings.automod.wh_channels.indexOf(channelId), 1);
  await settings.save();
  return `Salon supprimée de la liste blanche !`;
}
