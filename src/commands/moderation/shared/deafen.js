const { deafenTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await deafenTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.tag} est assourdi dans ce serveur`;
  }
  if (response === "MEMBER_PERM") {
    return `Vous n'avez pas la permission d'assourdir ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Je n'ai pas la permission d'assourdir ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} n'est dans aucun canal vocal`;
  }
  if (response === "ALREADY_DEAFENED") {
    return `${target.user.tag} est déjà assourdi`;
  }
  return `Impossible d'assourdir ${target.user.tag}`;
};
