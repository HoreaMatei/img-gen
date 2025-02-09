import express from "express";
import jwt from "jsonwebtoken";
import { createUser, enforceAuth, login } from "./auth.js";
import { generateImage } from "./image.js";
import cors from "cors";
const port = process.env.PORT || 3000;

const app = express();

const corsOptions = {
  origin: [
    "https://img-gen-njso.vercel.app",
    "https://img-gen-three.vercel.app",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const token = createUser(email, password);
    res.status(201).send({ message: "User created successfully", token });
  } catch (error) {
    res
      .status(400)
      .send({ error: "Creating user failed, invalid credentials." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = login(email, password);
    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).send({ error: error.message });
    }
    res
      .status(500)
      .send({ error: "Login failed, please check your credentials." });
  }
});

app.post("/generate-image", enforceAuth, async (req, res) => {
  const { prompt, options } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).send({ error: "Invalid prompt" });
  }
  const { image, format } = await generateImage(prompt, options);
  res.type(format);
  res.status(201).send(image);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
