const { moveTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason, channel) => {
  const response = await moveTarget(member, target, reason, channel);
  if (typeof response === "boolean") {
    return `${target.user.tag} a été déplacé avec succès vers: ${channel}`;
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
  if (response === "TARGET_PERM") {
    return `${target.user.tag} n'a pas la permission de rejoindre ${channel}`;
  }
  if (response === "ALREADY_IN_CHANNEL") {
    return `${target.user.tag} est déjà connecté à ${channel}`;
  }
  return `Échec du déplacement ${target.user.tag} pour ${channel}`;
};
