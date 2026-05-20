const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      gameName TEXT,

      tagLine TEXT,

      region TEXT,

      username TEXT,

      passwordEncrypted TEXT,

      puuid TEXT,

      summonerLevel INTEGER,

      profileIconId INTEGER,

      soloRank TEXT,

      soloLP INTEGER,

      soloWinrate REAL,

      flexRank TEXT,

      flexLP INTEGER,

      flexWinrate REAL,

      lastUpdated TEXT
    )
  `);
});

module.exports = db;