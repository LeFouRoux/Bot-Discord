const { purgeMessages } = require("@helpers/ModUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "purgeuser",
  description: "💩 ❱ Supprime le nombre spécifié de messages",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  botPermissions: ["ManageMessages", "ReadMessageHistory"],
  command: {
    enabled: true,
    usage: "<@user|ID> [amount]",
    aliases: ["purgeusers"],
    minArgsCount: 1,
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0]);
    if (!target) return message.safeReply(`Aucun utilisateur trouvé correspondant ${args[0]}`);
    const amount = (args.length > 1 && args[1]) || 99;

    if (amount) {
      if (isNaN(amount)) return message.safeReply("Seuls les chiffres sont autorisés");
      if (parseInt(amount) > 99) return message.safeReply("Le nombre maximum de messages que je peux supprimer est de 99");
    }

    const { channel } = message;
    const response = await purgeMessages(message.member, message.channel, "USER", amount, target);

    if (typeof response === "number") {
      return channel.safeSend(`Supprimé avec succès ${response} messages`, 5);
    } else if (response === "BOT_PERM") {
      return message.safeReply("Je n'ai pas `Lire l'historique des messages` et `Gérer les messages` pour supprimer des messages", 5);
    } else if (response === "MEMBER_PERM") {
      return message.safeReply("Vous n'avez pas `Lire l'historique des messages` et `Gérer les messages` pour supprimer des messages", 5);
    } else if (response === "NO_MESSAGES") {
      return channel.safeSend("Aucun message trouvé pouvant être nettoyé", 5);
    } else {
      return message.safeReply(`Erreur est survenue! Échec de la suppression des messages`);
    }
  },
};
