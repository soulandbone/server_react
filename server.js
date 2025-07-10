const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors()); // requisito para recibir requests desde mi app de React
app.use(express.json()); // Parse JSON bodies

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )`);
});
// const users = [
//   { username: "testuser", email: "test@test.com", password: "123456" },
// ];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error en la base" });
    }
    if (row) {
      res.json({ success: true, message: "Login exitoso" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Credenciales no validas" });
    }
  });
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const insert = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.run(insert, [username, email, password], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res
          .status(400)
          .json({ message: "Nombre de usuario o email ya existe" });
      }
      return res.status(500).json({ message: "Error en la base" });
    }
    res.json({ success: true, message: "Usuario registrado" });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server operando en puerto ${PORT}`);
});
