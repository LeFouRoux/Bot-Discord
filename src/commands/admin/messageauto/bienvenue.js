const { isHex } = require("@helpers/Utils");
const { buildGreeting } = require("@handlers/greeting");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "bienvenue",
  description: "🤖 ❱ Configurer le message de bienvenue",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "status <on|off>",
        description: "❓ ❱ Activer ou désactiver le message de bienvenue",
      },
      {
        trigger: "channel <#channel>",
        description: "🤖 ❱ Configurer le message de bienvenue",
      },
      {
        trigger: "preview",
        description: "🤖 ❱ Prévisualiser le message de bienvenue configuré",
      },
      {
        trigger: "desc <text>",
        description: "🤖 ❱ Définir la description de l'embed",
      },
      {
        trigger: "thumbnail <ON|OFF>",
        description: "❓ ❱ Activer/désactiver la vignette de l'embed",
      },
      {
        trigger: "color <hexcolor>",
        description: "🤖 ❱ Définir la couleur de l'embed",
      },
      {
        trigger: "footer <text>",
        description: "🤖 ❱ Définir le contenu du pied de page de l'embed",
      },
      {
        trigger: "image <url>",
        description: "🤖 ❱ Définir l'image de l'embed",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "❓ ❱ Activer ou désactiver le message de bienvenue",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "❓ ❱ Activé ou désactivé",
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
        name: "preview",
        description: "🤖 ❱ Prévisualiser le message de bienvenue configuré",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "channel",
        description: "🤖 ❱ Définir le selon de bienvenue",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "🤖 ❱ Nom du salon",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "desc",
        description: "🤖 ❱ Définir la description de l'embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "content",
            description: "🤖 ❱ Contenu descriptif",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "thumbnail",
        description: "🤖 ❱ Configurer la miniature de l'embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "🤖 ❱ Etat des vignettes",
            type: ApplicationCommandOptionType.String,
            required: true,
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
        name: "color",
        description: "🤖 ❱ Définir la couleur de l'embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "hex-code",
            description: "🤖 ❱ Code couleur hexadécimal (#0000)",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "footer",
        description: "🤖 ❱ Définir le pied de page de l'embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "content",
            description: "🤖 ❱ Contenu du pied de page",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "image",
        description: "🤖 ❱ Définir l'image de l'embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "url",
            description: "🤖 ❱ URL de l'image",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0].toLowerCase();
    const settings = data.settings;
    let response;

    // preview
    if (type === "preview") {
      response = await sendPreview(settings, message.member);
    }

    // status
    else if (type === "status") {
      const status = args[1]?.toUpperCase();
      if (!status || !["ON", "OFF"].includes(status))
        return message.safeReply("Statut invalide. La valeur doit être `Activité/Désactivé`");
      response = await setStatus(settings, status);
    }

    // channel
    else if (type === "channel") {
      const channel = message.mentions.channels.first();
      response = await setChannel(settings, channel);
    }

    // desc
    else if (type === "desc") {
      if (args.length < 2) return message.safeReply("Arguments insuffisants ! Veuillez fournir un contenu valide");
      const desc = args.slice(1).join(" ");
      response = await setDescription(settings, desc);
    }

    // thumbnail
    else if (type === "thumbnail") {
      const status = args[1]?.toUpperCase();
      if (!status || !["ON", "OFF"].includes(status))
        return message.safeReply("Statut invalide. La valeur doit être `Activité/Désactiv`");
      response = await setThumbnail(settings, status);
    }

    // color
    else if (type === "color") {
      const color = args[1];
      if (!color || !isHex(color)) return message.safeReply("Couleur invalide. La valeur doit être une couleur hexadécimale valide");
      response = await setColor(settings, color);
    }

    // footer
    else if (type === "footer") {
      if (args.length < 2) return message.safeReply("Arguments insuffisants ! Veuillez fournir un contenu valide");
      const content = args.slice(1).join(" ");
      response = await setFooter(settings, content);
    }

    // image
    else if (type === "image") {
      const url = args[1];
      if (!url) return message.safeReply("URL de l'image non valide. Veuillez fournir une URL valide");
      response = await setImage(settings, url);
    }

    //
    else response = "Utilisation de la commande invalide !";
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;
    switch (sub) {
      case "preview":
        response = await sendPreview(settings, interaction.member);
        break;

      case "status":
        response = await setStatus(settings, interaction.options.getString("status"));
        break;

      case "channel":
        response = await setChannel(settings, interaction.options.getChannel("channel"));
        break;

      case "desc":
        response = await setDescription(settings, interaction.options.getString("content"));
        break;

      case "thumbnail":
        response = await setThumbnail(settings, interaction.options.getString("status"));
        break;

      case "color":
        response = await setColor(settings, interaction.options.getString("color"));
        break;

      case "footer":
        response = await setFooter(settings, interaction.options.getString("content"));
        break;

      case "image":
        response = await setImage(settings, interaction.options.getString("url"));
        break;

      default:
        response = "Sous-commande invalide";
    }

    return interaction.followUp(response);
  },
};

async function sendPreview(settings, member) {
  if (!settings.welcome?.enabled) return "Message de bienvenue non activé sur ce serveur";

  const targetChannel = member.guild.channels.cache.get(settings.welcome.channel);
  if (!targetChannel) return "Aucun canal n'est configuré pour envoyer un message de bienvenue";

  const response = await buildGreeting(member, "WELCOME", settings.welcome);
  await targetChannel.safeSend(response);

  return `Sent welcome preview to ${targetChannel.toString()}`;
}

async function setStatus(settings, status) {
  const enabled = status.toUpperCase() === "ON" ? true : false;
  settings.welcome.enabled = enabled;
  await settings.save();
  return `Configuration enregistrée ! Message de bienvenue ${enabled ? "Activé" : "Désactivé"}`;
}

async function setChannel(settings, channel) {
  if (!channel.canSendEmbeds()) {
    return (
      "Pouah! Je ne peux pas envoyer de message d'accueil à ce canal ? J'ai besoin de `Write Messages` et `Embed Links` autorisations dans " +
      channel.toString()
    );
  }
  settings.welcome.channel = channel.id;
  await settings.save();
  return `Configuration enregistrée ! Un message de bienvenue sera envoyé à ${channel ? channel.toString() : "Pas trouvé"}`;
}

async function setDescription(settings, desc) {
  settings.welcome.embed.description = desc;
  await settings.save();
  return "Configuration enregistrée ! Message de bienvenue mis à jour";
}

async function setThumbnail(settings, status) {
  settings.welcome.embed.thumbnail = status.toUpperCase() === "ON" ? true : false;
  await settings.save();
  return "Configuration enregistrée ! Message de bienvenue mis à jour";
}

async function setColor(settings, color) {
  settings.welcome.embed.color = color;
  await settings.save();
  return "Configuration enregistrée ! Message de bienvenue mis à jour";
}

async function setFooter(settings, content) {
  settings.welcome.embed.footer = content;
  await settings.save();
  return "Configuration enregistrée ! Message de bienvenue mis à jour";
}

async function setImage(settings, url) {
  settings.welcome.embed.image = url;
  await settings.save();
  return "Configuration enregistrée ! Message de bienvenue mis à jour";
}
