const axios = require("axios");

const API_KEY = process.env.RIOT_API_KEY;

/*
|--------------------------------------------------------------------------
| HEADERS
|--------------------------------------------------------------------------
*/

const headers = {
  "X-Riot-Token": API_KEY,
  "User-Agent": "LeagueAccountManager",
  "Accept-Language": "es-CL,es;q=0.9,en;q=0.8",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8"
};

/*
|--------------------------------------------------------------------------
| REGIONES
|--------------------------------------------------------------------------
|
| Account API:
| americas.api.riotgames.com
|
| LAS:
| la2.api.riotgames.com
|
*/

const ACCOUNT_REGION = "americas";
const GAME_REGION = "la2";

/*
|--------------------------------------------------------------------------
| OBTENER CUENTA POR RIOT ID
|--------------------------------------------------------------------------
|
| Ejemplo:
| Zakiumy#LAS
|
| Devuelve:
| - puuid
| - gameName
| - tagLine
|
*/

async function getAccountByRiotId(gameName, tagLine) {
  try {
    // 🧹 Expresión regular para limpiar caracteres invisibles (BiDi marks, espacios de ancho cero, etc.)
    const cleanRegex = /[\u200B-\u200D\uFEFF\u202A-\u202E\u2066-\u2069]/g;

    const sanitizedName = gameName ? gameName.replace(cleanRegex, "").trim() : "";
    const sanitizedTag = tagLine ? tagLine.replace(cleanRegex, "").trim() : "";

    // 🚀 Codificar componentes para dar soporte completo a caracteres especiales o asiáticos (ej: チキンスープ)
    const encodedName = encodeURIComponent(sanitizedName);
    const encodedTag = encodeURIComponent(sanitizedTag);

    const url =
      `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`;

    const response = await axios.get(url, {
      headers
    });

    return response.data;

  } catch (error) {

    console.log("ERROR getAccountByRiotId");

    console.log(error.response?.status);

    console.log(error.response?.data);

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| OBTENER SUMMONER POR PUUID
|--------------------------------------------------------------------------
|
| Devuelve:
| - summonerLevel
| - profileIconId
| - summonerId
|
*/

async function getSummonerByPuuid(puuid) {

  try {

    const url =
      `https://${GAME_REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

    const response = await axios.get(url, {
      headers
    });

    return response.data;

  } catch (error) {

    console.log("ERROR getSummonerByPuuid");

    console.log(error.response?.status);

    console.log(error.response?.data);

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| OBTENER RANKEDS
|--------------------------------------------------------------------------
|
| Devuelve:
| - SoloQ
| - Flex
| - LP
| - Wins
| - Losses
|
*/

async function getLeagueEntries(puuid) {

  try {

    const url =
      `https://${GAME_REGION}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;

    const response = await axios.get(url, {
      headers
    });

    return response.data;

  } catch (error) {

    console.log("ERROR getLeagueEntries");

    console.log(error.response?.status);

    console.log(error.response?.data);

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getAccountByRiotId,
  getSummonerByPuuid,
  getLeagueEntries
};