const { vUnmuteTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await vUnmuteTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `La voix de ${target.user.tag} n'est pas muette sur ce serveur`;
  }
  if (response === "MEMBER_PERM") {
    return `Vous n'êtes pas autorisé à réactiver le son ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Je n'ai pas la permission d'activer la voix ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} n'est dans aucun canal vocal`;
  }
  if (response === "NOT_MUTED") {
    return `${target.user.tag} la voix n'est pas coupée`;
  }
  return `Impossible de réactiver le son ${target.user.tag}`;
};
