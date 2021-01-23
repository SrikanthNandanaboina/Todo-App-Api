const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "remotemysql.com",
  user: "hMuX1UDw2A",
  password: "s9roTiCItP",
  database: "hMuX1UDw2A",
});

connection.connect();

class Todo {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  static all(todo, callback) {
    connection.query(
      "SELECT * FROM todos WHERE email = ?",
      [todo.email],
      callback
    );
  }

  static get(todo, callback) {
    connection.query(
      "SELECT * FROM todos WHERE title = ?",
      [todo.title],
      callback
    );
  }

  static getById(todo, callback) {
    connection.query("SELECT * FROM todos WHERE id = ?", [todo.id], callback);
  }

  static add(todo, callback) {
    const sql = "INSERT INTO todos(title, email, completed) VALUES(?, ?, ?)";
    connection.query(sql, [todo.title, todo.email, 0], callback);
  }

  static update(todo, callback) {
    const sql =
      "UPDATE todos SET title = ?, completed = ? WHERE id = ? AND email = ?";
    connection.query(
      sql,
      [todo.title, todo.status, todo.id, todo.email],
      callback
    );
  }

  static delete(todo, callback) {
    const sql =
      "DELETE FROM todos WHERE id = ? AND email = ? AND completed = ?";
    connection.query(sql, [todo.id, todo.email, 0], callback);
  }
}

module.exports = Todo;
