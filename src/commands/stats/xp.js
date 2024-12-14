const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "levelup",
  description: "🏅 ❱ Configurer le système de mise à niveau",
  category: "STATS",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "message <new-message>",
        description: "🏅 ❱ Définir un message de niveau supérieur personnalisé",
      },
      {
        trigger: "channel <#channel|off>",
        description: "🏅 ❱ Définir le canal pour envoyer des messages de niveau supérieur à",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "message",
        description: "🏅 ❱ Définir un message de niveau supérieur personnalisé",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "message",
            description: "🏅 ❱ Message à afficher lorsqu'un utilisateur monte de niveau",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "channel",
        description: "🏅 ❱ Définir le canal pour envoyer des messages de niveau supérieur à",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "🏅 ❱ Canal auquel envoyer des messages de niveau supérieur",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const sub = args[0];
    const subcommandArgs = args.slice(1);
    let response;

    // message
    if (sub === "message") {
      const message = subcommandArgs.join(" ");
      response = await setMessage(message, data.settings);
    }

    // channel
    else if (sub === "channel") {
      const input = subcommandArgs[0];
      let channel;

      if (input === "off") channel = "off";
      else {
        const match = message.guild.findMatchingChannels(input);
        if (match.length === 0) return message.safeReply("Canal non valide. Veuillez fournir un canal valide");
        channel = match[0];
      }
      response = await setChannel(channel, data.settings);
    }

    // invalid
    else response = "Sous-commande invalide";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    let response;

    if (sub === "message") response = await setMessage(interaction.options.getString("message"), data.settings);
    else if (sub === "channel") response = await setChannel(interaction.options.getChannel("channel"), data.settings);
    else response = "Sous-commande invalide";

    await interaction.followUp(response);
  },
};

async function setMessage(message, settings) {
  if (!message) return "Message invalide. Veuillez fournir un message";
  settings.stats.xp.message = message;
  await settings.save();
  return `Configuration enregistrée. Message de niveau supérieur mis à jour !`;
}

async function setChannel(channel, settings) {
  if (!channel) return "Canal non valide. Veuillez fournir un canal";

  if (channel === "off") settings.stats.xp.channel = null;
  else settings.stats.xp.channel = channel.id;

  await settings.save();
  return `Configuration enregistrée. Chaîne de niveau supérieur mise à jour !`;
}
