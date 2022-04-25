const sqlite3 = require("sqlite3");

//sqlite3関連設定
const db = new sqlite3.Database("./db/liketion.sqlite3", (error: { message: string }) => {
  if (error) {
    console.error("database error: " + error.message);
  } else {
    db.serialize(() => {
      //都度table削除（あれば）
      db.run("drop table if exists likes");
      //table生成（無ければ）
      db.run(
        "create table if not exists likes( \
                id integer primary key autoincrement, \
                contentId nvwchar(255), \
                name nverchar(32) \
            )",
        (error: { message: string }) => {
          if (error) {
            console.error("table error: " + error.message);
          } else {
            //初期データinsert
            db.run("insert into likes(contentId,name) values(?,?)", "hoge", "kazuho");
            db.run("insert into likes(contentId,name) values(?,?)", "foo", "kazuho");
            db.run("insert into likes(contentId,name) values(?,?)", "hoge", "mizuki");
          }
        }
      );
    });
  }
});

module.exports = db;
