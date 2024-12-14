const { purgeMessages } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "purge",
  description: "💩 ❱ Purger les commandes",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "all",
        description: "💩 ❱ Purger tous les messages",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "💩 ❱ Canal à partir duquel les messages doivent être nettoyés",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "💩 ❱ Nombre de messages à supprimer (Max 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "attachments",
        description: "💩 ❱ Purger tous les messages avec pièces jointes",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "💩 ❱ Canal à partir duquel les messages doivent être nettoyés",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "💩 ❱ Nombre de messages à supprimer (Max 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "bots",
        description: "💩 ❱ Purger tous les messages du bot",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "💩 ❱ Canal à partir duquel les messages doivent être nettoyés",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "💩 ❱ Nombre de messages à supprimer (Max 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "links",
        description: "💩 ❱ Purger tous les messages avec des liens",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "💩 ❱ Canal à partir duquel les messages doivent être nettoyés",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "💩 ❱ Nombre de messages à supprimer (Max 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "token",
        description: "💩 ❱ Purger tous les messages contenant le jeton spécifié",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "💩 ❱ Canal à partir duquel les messages doivent être nettoyés",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "token",
            description: "💩 ❱ Jeton à rechercher dans les messages",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "amount",
            description: "💩 ❱ Nombre de messages à supprimer (Max 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "user",
        description: "💩 ❱ Purge tous les messages de l'utilisateur spécifié",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "💩 ❱ Canal à partir duquel les messages doivent être nettoyés",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "user",
            description: "💩 ❱ Utilisateur dont les messages doivent être nettoyés",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "amount",
            description: "💩 ❱ Nombre de messages à supprimer (Max 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
    ],
  },

  async interactionRun(interaction) {
    const { options, member } = interaction;

    const sub = options.getSubcommand();
    const channel = options.getChannel("channel");
    const amount = options.getInteger("amount") || 99;

    if (amount > 100) return interaction.followUp("Le nombre maximum de messages que je peux supprimer est de 99");

    let response;
    switch (sub) {
      case "all":
        response = await purgeMessages(member, channel, "ALL", amount);
        break;

      case "attachments":
        response = await purgeMessages(member, channel, "ATTACHMENT", amount);
        break;

      case "bots":
        response = await purgeMessages(member, channel, "BOT", amount);
        break;

      case "links":
        response = await purgeMessages(member, channel, "LINK", amount);
        break;

      case "token": {
        const token = interaction.options.getString("token");
        response = await purgeMessages(member, channel, "TOKEN", amount, token);
        break;
      }

      case "user": {
        const user = interaction.options.getUser("user");
        response = await purgeMessages(member, channel, "USER", amount, user);
        break;
      }

      default:
        return interaction.followUp("Oops! Pas une sélection de commande valide");
    }

    // Success
    if (typeof response === "number") {
      return interaction.followUp(`Nettoyé avec succès ${response} message dans ${channel}`);
    }

    // Member missing permissions
    else if (response === "MEMBER_PERM") {
      return interaction.followUp(
        `Vous n'êtes pas autorisé à lire l'historique des messages et à gérer les messages dans ${channel}`
      );
    }

    // Bot missing permissions
    else if (response === "BOT_PERM") {
      return interaction.followUp(`Je n'ai pas les autorisations pour lire l'historique des messages et gérer les messages dans ${channel}`);
    }

    // No messages
    else if (response === "NO_MESSAGES") {
      return interaction.followUp("Aucun message pouvant être nettoyé trouvé");
    }

    // Remaining
    else {
      return interaction.followUp("Échec du nettoyage des messages");
    }
  },
};
