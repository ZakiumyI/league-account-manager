export const rankValue = {
  IRON: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  EMERALD: 5,
  DIAMOND: 6,
  MASTER: 7,
  GRANDMASTER: 8,
  CHALLENGER: 9
};

export function getSoloScore(a) {
  const tier = a.soloRank?.split(" ")[0];
  return (rankValue[tier] ?? -1) * 1000 + (a.soloLP || 0);
}