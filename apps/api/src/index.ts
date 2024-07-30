import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { COOKIE_MAX_AGE } from "./consts";
import authRouter from "./router/auth";

const app = express();

app.use(cors({
  origin: ["http://localhost:3001"],
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: COOKIE_MAX_AGE },
}));

app.use("/auth", authRouter);

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})