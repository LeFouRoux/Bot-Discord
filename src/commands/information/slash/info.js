const user = require("../shared/user");
const channelInfo = require("../shared/channel");
const guildInfo = require("../shared/guild");
const avatar = require("../shared/avatar");
const emojiInfo = require("../shared/emoji");
const botInfo = require("../shared/botstats");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "info",
  description: "👀 ❱ Afficher diverses informations",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "👀 ❱ Obtenir des informations sur l'utilisateur",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "👀 ❱ Nom de l'utilisateur",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "channel",
        description: "👀 ❱ Obtenir des informations sur la chaîne",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "👀 ❱ Nom de la chaîne",
            type: ApplicationCommandOptionType.Channel,
            required: false,
          },
        ],
      },
      {
        name: "guild",
        description: "👀 ❱ Obtenir des informations sur la guilde",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "bot",
        description: "👀 ❱ Obtenir des informations sur le bot",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "avatar",
        description: "👀 ❱ Affiche des informations sur l'avatar",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "👀 ❱ Nom de l'utilisateur",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "emoji",
        description: "👀 ❱ Affiche des informations sur les emoji",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "👀 ❱ Nom de l'emoji",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    if (!sub) return interaction.followUp("Pas une sous-commande valide");
    let response;

    // user
    if (sub === "user") {
      let targetUser = interaction.options.getUser("name") || interaction.user;
      let target = await interaction.guild.members.fetch(targetUser);
      response = user(target);
    }

    // channel
    else if (sub === "channel") {
      let targetChannel = interaction.options.getChannel("name") || interaction.channel;
      response = channelInfo(targetChannel);
    }

    // guild
    else if (sub === "guild") {
      response = await guildInfo(interaction.guild);
    }

    // bot
    else if (sub === "bot") {
      response = botInfo(interaction.client);
    }

    // avatar
    else if (sub === "avatar") {
      let target = interaction.options.getUser("name") || interaction.user;
      response = avatar(target);
    }

    // emoji
    else if (sub === "emoji") {
      let emoji = interaction.options.getString("name");
      response = emojiInfo(emoji);
    }

    // return
    else {
      response = "Sous-commande incorrecte";
    }

    await interaction.followUp(response);
  },
};
