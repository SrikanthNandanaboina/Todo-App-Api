const pool = require("./database");
class Todo {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  static all(todo, callback) {
    pool.query("SELECT * FROM todos WHERE email = ?", [todo.email], callback);
  }

  static get(todo, callback) {
    pool.query("SELECT * FROM todos WHERE title = ?", [todo.title], callback);
  }

  static getById(todo, callback) {
    pool.query("SELECT * FROM todos WHERE id = ?", [todo.id], callback);
  }

  static add(todo, callback) {
    const sql = "INSERT INTO todos(title, email, completed) VALUES(?, ?, ?)";
    pool.query(sql, [todo.title, todo.email, 0], callback);
  }

  static update(todo, callback) {
    const sql =
      "UPDATE todos SET title = ?, completed = ? WHERE id = ? AND email = ?";
    pool.query(sql, [todo.title, todo.status, todo.id, todo.email], callback);
  }

  static delete(todo, callback) {
    const sql =
      "DELETE FROM todos WHERE id = ? AND email = ? AND completed = ?";
    pool.query(sql, [todo.id, todo.email, 0], callback);
  }
}

module.exports = Todo;
