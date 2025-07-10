const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // requisito para recibir requests desde mi app de React
app.use(express.json()); // Parse JSON bodies

const users = [
  { username: "testuser", email: "test@test.com", password: "123456" },
];

app.post("/login", (req, res) => {
  // Para caso de login
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, message: "Login exitoso" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Credenciales no validas" });
  }
});

app.post("/register", (req, res) => {
  // Para el otro caso de registro
  const { username, email, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Nombr de usuario ya existe" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email ya existe" });
  }
  users.push({ username, password });
  res.json({ success: true, message: "Usuario registrado" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server operando en puerto ${PORT}`);
});
