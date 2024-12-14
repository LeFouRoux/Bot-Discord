const mongoose = require("mongoose");
const { log, success, error } = require("../helpers/Logger");

module.exports = {
  async initializeMongoose() {
    log(`Connexion a MongoDb...`);

    try {
      await mongoose.connect(process.env.MONGO_CONNECTION, {
        keepAlive: true,
      });

      success("Mongoose: Connexion a la base de donnees etablie");

      return mongoose.connection;
    } catch (err) {
      error("Mongoose: Impossible de se connecter à la base de donnees", err);
      process.exit(1);
    }
  },

  schemas: {
    Giveaways: require("./schemas/Giveaways"),
    Guild: require("./schemas/Guild"),
    Member: require("./schemas/Member"),
    ReactionRoles: require("./schemas/ReactionRoles").model,
    ModLog: require("./schemas/ModLog").model,
    TranslateLog: require("./schemas/TranslateLog").model,
    User: require("./schemas/User"),
    Suggestions: require("./schemas/Suggestions").model,
  },
};
