module.exports = {
  OWNER_IDS: ["1147184446412423189"], // ID du fondateur
  SUPPORT_SERVER: "LIEN_DISCORD", // Discord Support/Communautaire
  FDO: "LIEN DISCORD FORCE DE L'ORDRE",
  BOUTIQUE: "Lien de la boutique",
  TOPSERV: "LIEN TOP SERVEUR",
  COLLEC: "LIEN DE LA COLLECTION",
  STATUT: "Serveur en développement", // Texte pour mettre dans l'embed Statut.js
  Regle: "LIEN REGLEMENT",
  SITE: "SITE_WEB",
  LOGO: "LIEN_LOGO",
  SERVEURP: "NOM DU SERVEUR RP",
  IPSERV: "IP DU SERVEUR",
  PREFIX_COMMANDS: {
    ENABLED: true, // Activer le préfix = true | Désactivé = false
    DEFAULT_PREFIX: "+", // Préfix par défault
  },
  INTERACTIONS: {
    SLASH: true, // Activer les commandes slash = true | Désactivé = false
    CONTEXT: true, // Les contextes doivent-ils être activés ?
    GLOBAL: true, // Les interactions doivent-elles être enregistrées globalement
    TEST_GUILD_ID: "ID_GUILD", // ID de serveur où les interactions doivent être enregistrées. [** Testez d'abord vos commandes ici **]
  },
  EMBED_COLORS: {
    BOT_EMBED: "#068ADD",
    TRANSPARENT: "#36393F",
    SUCCESS: "#00A56A",
    ERROR: "#D61A3C",
    WARNING: "#F7E919",
  },
  CACHE_SIZE: {
    GUILDS: 100,
    USERS: 10000,
    MEMBERS: 10000,
  },
  MESSAGES: {
    API_ERROR: "Erreur dorsale inattendue ! Réessayez plus tard ou contactez le serveur d'assistance",
  },

  // PLUGINS

  AUTOMOD: {
    ENABLED: true,
    LOG_EMBED: "#36393F",
    DM_EMBED: "#36393F",
  },

  DASHBOARD: {
    enabled: false, // Activer le dashboard = true | Désactivé = false
    baseURL: "http://localhost:8080", // URL
    failureURL: "http://localhost:8080", // FAIL URL
    port: "8080", // Le port sur le quelle le dashboard va ce lancer
  },

  ECONOMY: {
    ENABLED: false,
    CURRENCY: " <:coinicon:1076212434248937514>",
    DAILY_COINS: 100, // pièces journalier
    MIN_BEG_AMOUNT: 100, // minimum de pièces à recevoir lorsque la commande beg est utilisée
    MAX_BEG_AMOUNT: 2500, // nombre maximum de pièces à recevoir lorsque la commande beg est utilisée
  },

  MUSIC: {
    ENABLED: false,
    IDLE_TIME: 60, // Temps en secondes avant que le bot ne se déconnecte d'un canal vocal inactif
    MAX_SEARCH_RESULTS: 5,
    DEFAULT_SOURCE: "YTM", // YT = Youtube, YTM = Youtube Music, SC = SoundCloud
    // Ajoutez n'importe quel nombre de nœuds lavalink ici
    // Reportez-vous à https://github.com/freyacodes/Lavalink pour héberger votre propre serveur lavalink
    LAVALINK_NODES: [
      {
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
        id: "Local Node",
        secure: false,
      },
    ],
  },

  GIVEAWAYS: {
    ENABLED: false,
    REACTION: "🎁",
    START_EMBED: "#FF468A",
    END_EMBED: "#FF468A",
  },

  IMAGE: {
    ENABLED: false,
    BASE_API: "https://strangeapi.fun/api",
  },

  INVITE: {
    ENABLED: true,
  },

  MODERATION: {
    ENABLED: true,
    EMBED_COLORS: {
      TIMEOUT: "#102027",
      UNTIMEOUT: "#4B636E",
      KICK: "#FF7961",
      SOFTBAN: "#AF4448",
      BAN: "#D32F2F",
      UNBAN: "#00C853",
      VMUTE: "#102027",
      VUNMUTE: "#4B636E",
      DEAFEN: "#102027",
      UNDEAFEN: "#4B636E",
      DISCONNECT: "RANDOM",
      MOVE: "RANDOM",
    },
  },

  PRESENCE: {
    ENABLED: true, // Si le bot doit ou non mettre à jour son statut
    STATUS: "online", // Le statut du bot [en ligne, inactif, mdn, invisible]
    TYPE: "WATCHING", // Type de statut pour le bot [JOUER | ÉCOUTE | REGARDER | EN CONCURRENCE]
    MESSAGE: "{members} membres", // Votre message de statut de bot {members} membres. | .gg/redlitefa
  },

  STATS: {
    ENABLED: true,
    XP_COOLDOWN: 5, // Temps de recharge en secondes entre les messages
    DEFAULT_LVL_UP_MSG: "{member}, Tu viens de monter **Level {level}**",
  },

  SUGGESTIONS: {
    ENABLED: false, // Le système de suggestion doit-il être activé
    EMOJI: {
      UP_VOTE: "⬆️",
      DOWN_VOTE: "⬇️",
    },
    DEFAULT_EMBED: "#4F545C",
    APPROVED_EMBED: "#43B581",
    DENIED_EMBED: "#F04747",
  },

  TICKET: {
    ENABLED: false,
    CREATE_EMBED: "#43B581",
    CLOSE_EMBED: "#F04747",
  },
};
