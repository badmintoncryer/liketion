import fs from "fs";

import { Database } from "sqlite3";
import { v4 as uuidv4 } from "uuid";

const sqlite3 = require("sqlite3");

/**
 * Generate random DB names
 *
 * @return {string}
 */
const getRandomDbPath = (): string => `./test_db/${uuidv4()}.sqlite`;

/**
 * Create an independent DB for each test to ensure test independence
 *
 * @param {string} randomDbPath
 * @return {Database}
 */
const createDbConnection = (randomDbPath: string): Database => {
  const db: Database = new sqlite3.Database(randomDbPath, (error: { message: string }) => {
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

const db = createDbConnection(getRandomDbPath());

module.exports = db;
