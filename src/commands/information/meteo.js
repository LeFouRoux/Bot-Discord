const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { MESSAGES, EMBED_COLORS } = require("@root/config.js");
const { getJson } = require("@helpers/HttpUtils");

const API_KEY = process.env.WEATHERSTACK_KEY;

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "meteo",
  description: "🌧️ ❱ Obtenir des informations météorologiques.",
  cooldown: 5,
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "<place>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "place",
        description: "🌧️ ❱ Nom du pays/de la ville pour obtenir des informations météorologiques pour",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const place = args.join(" ");
    const response = await weather(place);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const place = interaction.options.getString("place");
    const response = await weather(place);
    await interaction.followUp(response);
  },
};

async function weather(place) {
  const response = await getJson(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${place}`);
  if (!response.success) return MESSAGES.API_ERROR;

  const json = response.data;
  if (!json.request) return `Aucune ville trouvée \`${place}\``;

  const embed = new EmbedBuilder()
    .setTitle("Météo")
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setThumbnail(json.current?.weather_icons[0])
    .addFields(
      { name: "Ville", value: json.location?.name || "NA", inline: true },
      { name: "Région", value: json.location?.region || "NA", inline: true },
      { name: "Pays", value: json.location?.country || "NA", inline: true },
      { name: "Les conditions météorologiques", value: json.current?.weather_descriptions[0] || "NA", inline: true },
      { name: "Date", value: json.location?.localtime.slice(0, 10) || "NA", inline: true },
      { name: "Temps", value: json.location?.localtime.slice(11, 16) || "NA", inline: true },
      { name: "Température", value: `${json.current?.temperature}°C`, inline: true },
      { name: "Couverture nuageuse", value: `${json.current?.cloudcover}%`, inline: true },
      { name: "Vitesse du vent", value: `${json.current?.wind_speed} km/h`, inline: true },
      { name: "Direction du vent", value: json.current?.wind_dir || "NA", inline: true },
      { name: "Pression", value: `${json.current?.pressure} mb`, inline: true },
      { name: "Précipitation", value: `${json.current?.precip.toString()} mm`, inline: true },
      { name: "Humidité", value: json.current?.humidity.toString() || "NA", inline: true },
      { name: "Distance visuelle", value: `${json.current?.visibility} km`, inline: true },
      { name: "L'indice UV", value: json.current?.uv_index.toString() || "NA", inline: true }
    )
    .setFooter({ text: `Dernière vérification à ${json.current?.observation_time} GMT` });

  return { embeds: [embed] };
}
