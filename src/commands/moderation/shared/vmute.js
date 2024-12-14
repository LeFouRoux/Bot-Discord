const { vMuteTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await vMuteTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `La voix de ${target.user.tag} est coupée sur ce serveur`;
  }
  if (response === "MEMBER_PERM") {
    return `Vous n'êtes pas autorisé à désactiver la voix ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Je n'ai pas la permission de désactiver la voix ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} n'est dans aucun canal vocal`;
  }
  if (response === "ALREADY_MUTED") {
    return `${target.user.tag} est déjà en sourdine`;
  }
  return `Échec de la désactivation de la voix ${target.user.tag}`;
};
