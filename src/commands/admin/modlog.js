const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "modlog",
  description: "📃 ❱ Activer ou désactiver les logs",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<#channel|off>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "channel",
        description: "📁 ❱ Salon pour envoyer des logs",
        required: false,
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    let targetChannel;

    if (input === "none" || input === "off" || input === "désactiver") targetChannel = null;
    else {
      if (message.mentions.channels.size === 0) return message.safeReply("Utilisation incorrecte de la commande");
      targetChannel = message.mentions.channels.first();
    }

    const response = await setChannel(targetChannel, data.settings);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const response = await setChannel(interaction.options.getChannel("channel"), data.settings);
    return interaction.followUp(response);
  },
};

async function setChannel(targetChannel, settings) {
  if (targetChannel && !targetChannel.canSendEmbeds()) {
    return "Pouah! Je ne peux pas envoyer de logs à ce salon ? J'ai besoin des autorisations `Write Messages` et `Embed Links` dans ce salon";
  }

  settings.modlog_channel = targetChannel?.id;
  await settings.save();
  return `Configuration enregistrée ! Chaîne Modlog ${targetChannel ? "mis à jour" : "supprimé"}`;
}
