const { getRankScore } = require("../utils/rankUtils");
const { encrypt } = require("../utils/crypto");
const { decrypt } = require("../utils/crypto");

const db = require("../db/database");

const riotService = require("../services/riotService");

/*
|--------------------------------------------------------------------------
| HELPER: GET SCORE FROM STRING RANK (Para el ordenamiento dinámico)
|--------------------------------------------------------------------------
*/
function getScoreFromFullRank(fullRankString, lp) {
  if (!fullRankString || fullRankString === "UNRANKED") return 0;
  
  // Separa "DIAMOND IV" en tier: "DIAMOND" y rank: "IV" (si es que getRankScore lo requiere)
  const parts = fullRankString.split(" ");
  const tier = parts[0]; 
  
  if (typeof getRankScore === "function") {
    return getRankScore(tier, lp || 0);
  }
  return 0;
}

/*
|--------------------------------------------------------------------------
| WINRATE
|--------------------------------------------------------------------------
*/
function calculateWinrate(wins, losses) {
  const total = wins + losses;
  if (!total) return 0;

  return Number(((wins / total) * 100).toFixed(1));
}

/*
|--------------------------------------------------------------------------
| CREATE ACCOUNT
|--------------------------------------------------------------------------
*/
async function createAccount(req, res) {
  try {
    const { gameName, tagLine, region, username, password } = req.body;

    const riotAccount = await riotService.getAccountByRiotId(
      gameName,
      tagLine
    );

    const summoner = await riotService.getSummonerByPuuid(
      riotAccount.puuid
    );

    const leagues = await riotService.getLeagueEntries(
      riotAccount.puuid
    );

    let soloQueue = null;
    let flexQueue = null;

    for (const league of leagues) {
      if (league.queueType === "RANKED_SOLO_5x5") soloQueue = league;
      if (league.queueType === "RANKED_FLEX_SR") flexQueue = league;
    }

    // 🔐 encrypt password (REVERSIBLE)
    const passwordEncrypted = encrypt(password);

    db.run(
      `
      INSERT INTO accounts (
        gameName,
        tagLine,
        region,
        username,
        passwordEncrypted,
        puuid,
        summonerLevel,
        profileIconId,
        soloRank,
        soloLP,
        soloWinrate,
        flexRank,
        flexLP,
        flexWinrate,
        lastUpdated
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        riotAccount.gameName,
        riotAccount.tagLine,
        region,
        username,
        passwordEncrypted,
        riotAccount.puuid,
        summoner.summonerLevel,
        summoner.profileIconId,

        soloQueue
          ? `${soloQueue.tier} ${soloQueue.rank}`
          : "UNRANKED",

        soloQueue ? soloQueue.leaguePoints : 0,

        soloQueue
          ? calculateWinrate(soloQueue.wins, soloQueue.losses)
          : 0,

        flexQueue
          ? `${flexQueue.tier} ${flexQueue.rank}`
          : "UNRANKED",

        flexQueue ? flexQueue.leaguePoints : 0,

        flexQueue
          ? calculateWinrate(flexQueue.wins, flexQueue.losses)
          : 0,

        new Date().toISOString()
      ],
      function (err) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database insert error" });
        }

        return res.json({
          message: "Account created",
          accountId: this.lastID,
          account: {
            id: this.lastID,

            gameName: riotAccount.gameName,
            tagLine: riotAccount.tagLine,
            summonerLevel: summoner.summonerLevel,
            profileIconId: summoner.profileIconId,

            username,
            password: passwordEncrypted, 

            soloRank: soloQueue
              ? `${soloQueue.tier} ${soloQueue.rank}`
              : "UNRANKED",

            soloLP: soloQueue ? soloQueue.leaguePoints : 0,

            soloWinrate: soloQueue
              ? calculateWinrate(soloQueue.wins, soloQueue.losses)
              : 0,

            soloScore:
              soloQueue && getRankScore
                ? getRankScore(
                    soloQueue.tier,
                    soloQueue.leaguePoints
                  )
                : 0,

            flexRank: flexQueue
              ? `${flexQueue.tier} ${flexQueue.rank}`
              : "UNRANKED",

            flexLP: flexQueue ? flexQueue.leaguePoints : 0,

            flexWinrate: flexQueue
              ? calculateWinrate(flexQueue.wins, flexQueue.losses)
              : 0,

            flexScore:
              flexQueue && getRankScore
                ? getRankScore(
                    flexQueue.tier,
                    flexQueue.leaguePoints
                  )
                : 0
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.response?.data || error.message
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET ACCOUNTS (Ajustado con ordenamiento jerárquico multinivel)
|--------------------------------------------------------------------------
*/
function getAccounts(req, res) {
  db.all(
    `
    SELECT
      id,
      gameName,
      tagLine,
      region,
      username,
      passwordEncrypted,
      puuid,
      summonerLevel,
      profileIconId,
      soloRank,
      soloLP,
      soloWinrate,
      flexRank,
      flexLP,
      flexWinrate,
      lastUpdated
    FROM accounts
    `,
    [],
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database read error" });
      }

      // 1. Mapeamos y desencriptamos las contraseñas
      const parsed = rows.map((r) => ({
        ...r,
        password: decrypt(r.passwordEncrypted) 
      }));

      // 2. Ordenamos en cascada: SoloQ (Descendente) -> Flex (Descendente) -> Nivel (Descendente)
      parsed.sort((a, b) => {
        // Criterio 1: Clasificatoria Solo Q
        const scoreSoloA = getScoreFromFullRank(a.soloRank, a.soloLP);
        const scoreSoloB = getScoreFromFullRank(b.soloRank, b.soloLP);
        if (scoreSoloB !== scoreSoloA) {
          return scoreSoloB - scoreSoloA; 
        }

        // Criterio 2: Clasificatoria Flex
        const scoreFlexA = getScoreFromFullRank(a.flexRank, a.flexLP);
        const scoreFlexB = getScoreFromFullRank(b.flexRank, b.flexLP);
        if (scoreFlexB !== scoreFlexA) {
          return scoreFlexB - scoreFlexA;
        }

        // Criterio 3: Nivel de Invocador (summonerLevel)
        const levelA = a.summonerLevel || 0;
        const levelB = b.summonerLevel || 0;
        return levelB - levelA;
      });

      return res.json(parsed);
    }
  );
}

/*
|--------------------------------------------------------------------------
| REFRESH ACCOUNT
|--------------------------------------------------------------------------
*/
async function refreshAccount(req, res) {
  try {
    const { id } = req.params;

    db.get(
      `SELECT * FROM accounts WHERE id = ?`,
      [id],
      async (err, account) => {
        if (err || !account) {
          return res.status(404).json({ error: "Account not found" });
        }

        const riotAccount = await riotService.getAccountByRiotId(
          account.gameName,
          account.tagLine
        );

        const summoner = await riotService.getSummonerByPuuid(
          riotAccount.puuid
        );

        const leagues = await riotService.getLeagueEntries(
          riotAccount.puuid
        );

        let solo = null;
        let flex = null;

        for (const l of leagues) {
          if (l.queueType === "RANKED_SOLO_5x5") solo = l;
          if (l.queueType === "RANKED_FLEX_SR") flex = l;
        }

        const soloWR = solo
          ? (solo.wins / (solo.wins + solo.losses)) * 100
          : 0;

        const flexWR = flex
          ? (flex.wins / (flex.wins + flex.losses)) * 100
          : 0;

        db.run(
          `
          UPDATE accounts SET
            summonerLevel = ?,
            profileIconId = ?,
            soloRank = ?,
            soloLP = ?,
            soloWinrate = ?,
            flexRank = ?,
            flexLP = ?,
            flexWinrate = ?,
            lastUpdated = ?
          WHERE id = ?
          `,
          [
            summoner.summonerLevel,
            summoner.profileIconId,

            solo ? `${solo.tier} ${solo.rank}` : "UNRANKED",
            solo ? solo.leaguePoints : 0,
            soloWR.toFixed(1),

            flex ? `${flex.tier} ${flex.rank}` : "UNRANKED",
            flex ? flex.leaguePoints : 0,
            flexWR.toFixed(1),

            new Date().toISOString(),
            id
          ],
          function (err2) {
            if (err2) {
              return res.status(500).json({ error: "Update failed" });
            }

            return res.json({
              message: "Account refreshed",
              id
            });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE ACCOUNT
|--------------------------------------------------------------------------
*/
function deleteAccount(req, res) {
  const { id } = req.params;

  db.run(
    `DELETE FROM accounts WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Delete error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Account not found" });
      }

      return res.json({
        message: "Account deleted",
        id
      });
    }
  );
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
  createAccount,
  getAccounts,
  refreshAccount,
  deleteAccount
};