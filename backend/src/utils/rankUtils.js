// backend/src/utils/rankUtils.js

const rankValue = {
  IRON: 0,
  BRONZE: 400,
  SILVER: 800,
  GOLD: 1200,
  PLATINUM: 1600,
  EMERALD: 2000,
  DIAMOND: 2400,
  MASTER: 2800,
  GRANDMASTER: 3200,
  CHALLENGER: 3600
};

function getRankScore(tier, lp = 0) {
  if (!tier) return 0;

  return (rankValue[tier.toUpperCase()] || 0) + lp;
}

module.exports = { getRankScore };