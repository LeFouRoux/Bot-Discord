const deafen = require("../shared/deafen");
const vmute = require("../shared/vmute");
const vunmute = require("../shared/vunmute");
const undeafen = require("../shared/undeafen");
const disconnect = require("../shared/disconnect");
const move = require("../shared/move");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "voice",
  description: "💩 ❱ Commandes de modération vocale",
  category: "MODERATION",
  userPermissions: ["MuteMembers", "MoveMembers", "DeafenMembers"],
  botPermissions: ["MuteMembers", "MoveMembers", "DeafenMembers"],
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "mute",
        description: "💩 ❱ Couper la voix d'un membre",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "💩 ❱ Raison du muet",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "unmute",
        description: "💩 ❱ Réactiver la voix d'un membre en sourdine",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "💩 ❱ Raison de la réactivation du son",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "deafen",
        description: "💩 ❱ Assourdir un membre dans le canal vocal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "💩 ❱ Raison d'assourdir",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "undeafen",
        description: "💩 ❱ Rendre sourd un membre dans le canal vocal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "💩 ❱ Raison de non-sourdissement",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "kick",
        description: "💩 ❱ Expulser un membre du canal vocal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "💩 ❱ Raison du muet",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "move",
        description: "💩 ❱ Déplacer un membre d'un canal vocal à un autre",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "💩 ❱ Le membre cible",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "channel",
            description: "💩 ❱ Le canal vers lequel déplacer le membre",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice, ChannelType.GuildStageVoice],
            required: true,
          },
          {
            name: "reason",
            description: "💩 ❱ Raison du muet",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
    ],
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    const reason = interaction.options.getString("reason");

    const user = interaction.options.getUser("user");
    const target = await interaction.guild.members.fetch(user.id);

    let response;

    if (sub === "mute") response = await vmute(interaction, target, reason);
    else if (sub === "unmute") response = await vunmute(interaction, target, reason);
    else if (sub === "deafen") response = await deafen(interaction, target, reason);
    else if (sub === "undeafen") response = await undeafen(interaction, target, reason);
    else if (sub === "kick") response = await disconnect(interaction, target, reason);
    else if (sub == "move") {
      const channel = interaction.options.getChannel("channel");
      response = await move(interaction, target, reason, channel);
    }

    await interaction.followUp(response);
  },
};
