import fs from "fs";

import { Database } from "sqlite3";

const sqlite3 = require("sqlite3");

/**
 * Create an independent DB for each test to ensure test independence
 *
 * @param {string} randomDbPath
 * @return {Database}
 */
const createDbConnection = (): Database => {
  const db: Database = new sqlite3.Database("./db/test.sqlite", (error: { message: string }) => {
    if (error) {
      console.error("database error: " + error.message);
    } else {
      db.serialize(() => {
        //table生成（無ければ）
        db.run(
          "create table if not exists likes( \
                id integer primary key autoincrement, \
                contentId nvwchar(255), \
                name nverchar(64) \
            )",
          (error: { message: string }) => {
            if (error) {
              console.error("table error: " + error.message);
            }
          }
        );
      });
    }
  });

  return db;
};

/**
 * Remove DB file
 *
 * @param {string} dbPath
 */
const deleteDbFile = (dbPath: string): void => {
  fs.unlinkSync(dbPath);
};

const db = createDbConnection();

module.exports = db;
