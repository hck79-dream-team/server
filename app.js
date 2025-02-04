const express = require("express");
const { User } = require("./models");
const bcrypt = require("bcrypt");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).send({ error: "Invalid password" });
  }

  const access_token = jwt.sign({ id: user.id }, "AAAA");

  res.send({
    access_token,
  });
});
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.status(201).send({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ error: "Email already exists" });
    } else if (error.name === "SequelizeValidationError") {
      res.status(400).send({ error: error.errors[0].message });
    } else {
      res.status(400).send({ error: error.message });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
