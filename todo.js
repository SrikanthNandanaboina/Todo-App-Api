const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  const sql =
    "CREATE TABLE IF NOT EXISTS todos (id integer primary key, title VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, completed integer)";
  db.run(sql);
});

class Todo {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  static all(todo, callback) {
    db.all("SELECT * FROM todos WHERE email = ?", todo.email, callback);
  }

  static get(todo, callback) {
    db.get("SELECT * FROM todos WHERE title = ?", todo.title, callback);
  }

  static getById(todo, callback) {
    db.get("SELECT * FROM todos WHERE id = ?", todo.id, callback);
  }

  static add(todo, callback) {
    const sql = "INSERT INTO todos(title, email, completed) VALUES(?, ?, ?)";
    db.run(sql, todo.title, todo.email, 0, callback);
  }

  static update(todo, callback) {
    const sql =
      "UPDATE todos SET title = ?, completed = ? WHERE id = ? AND email = ?";
    db.run(sql, todo.title, todo.status, todo.id, todo.email, callback);
  }

  static delete(todo, callback) {
    const sql =
      "DELETE FROM todos WHERE id = ? AND email = ? AND completed = ?";
    db.run(sql, todo.id, todo.email, 0, callback);
  }
}

module.exports = Todo;
