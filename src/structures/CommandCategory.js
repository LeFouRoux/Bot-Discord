const config = require("@root/config");

module.exports = {
  ADMIN: {
    name: "Admin",
    image: "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
    emoji: "⚙️",
  },
  AUTOMOD: {
    name: "Automod",
    enabled: config.AUTOMOD.ENABLED,
    image: "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
    emoji: "🤖",
  },
  INFORMATION: {
    name: "Information",
    image: "https://icons.iconarchive.com/icons/graphicloads/100-flat/128/information-icon.png",
    emoji: "🪧",
  },
  MODERATION: {
    name: "Modération",
    enabled: config.MODERATION.ENABLED,
    image: "https://icons.iconarchive.com/icons/lawyerwordpress/law/128/Gavel-Law-icon.png",
    emoji: "🔨",
  },
  OWNER: {
    name: "Owner",
    image: "https://www.pinclipart.com/picdir/middle/531-5318253_web-designing-icon-png-clipart.png",
    emoji: "🤴",
  },
  STATS: {
    name: "Statistiques",
    enabled: config.STATS.ENABLED,
    image: "https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/dollar-stats-icon.png",
    emoji: "📈",
  },
  GMOD: {
    name: "GMOD",
    image: "https://cdn.discordapp.com/attachments/1091765399525281944/1097871499202932756/contentbox.jpg",
    emoji: "💎",
  },
};
