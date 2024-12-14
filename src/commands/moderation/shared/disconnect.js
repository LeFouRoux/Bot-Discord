const { disconnectTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await disconnectTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.tag} est déconnecté du canal vocal`;
  }
  if (response === "MEMBER_PERM") {
    return `Vous n'êtes pas autorisé à vous déconnecter ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Je n'ai pas la permission de me déconnecter ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} n'est dans aucun canal vocal`;
  }
  return `Échec de la déconnexion ${target.user.tag}`;
};
