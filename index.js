const express = require("express");
const UserAuth = require("./UserAuth");

// Express server setup
const app = express();
app.use(express.json());

const auth = new UserAuth();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await auth.authenticateUser(username, password);
  res.json(result);
});

app.get("/protected", (req, res) => {
  const { username, token } = req.query;

  if (auth.verifyToken(username, token)) {
    res.json({ data: "This is protected data" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Example usage:
// curl -X POST -H "Content-Type: application/json" -d '{"username":"user","password":"pass"}' http://localhost:3000/login
// curl "http://localhost:3000/protected?username=user&token=xyz123"
