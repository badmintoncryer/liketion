import { Database } from "sqlite3";

const sqlite3 = require("sqlite3");

//sqlite3関連設定
const db: Database = new sqlite3.Database("./db/liketion.sqlite3", (error: { message: string }) => {
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

module.exports = db;
