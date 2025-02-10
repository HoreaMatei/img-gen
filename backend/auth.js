import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";

const secretKey = process.env.JWT_SECRET_KEY;

export function createUser(email, password) {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (user) {
    throw new Error("User creation failed, invalid credentials.");
  }

  const hashedPassword = bcrypt.hashSync(password, 12);

  const result = db
    .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
    .run(email, hashedPassword);
  const token = jwt.sign({ id: result.lastInsertRowid }, secretKey, {
    expiresIn: "1h",
  });

  return token;
}

export function login(email, password) {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }

  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

  return token;
}

export function enforceAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Unauthenticated" });
  }
  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    return res.status(401).send({ error: "Unauthenticated" });
  }
}
