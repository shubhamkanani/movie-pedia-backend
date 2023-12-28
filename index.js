import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

/* Environment Variable */
import dotenv from "dotenv";
dotenv.config();

/* Establish Mongodb Connection */
import connectDB from "./config/db.config.js";
connectDB();

/* Routes */
import Routes from "./api/routes/index.js";

/* Body Parser Middleware */
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

/* CORS */
app.use(cors({ origin: "*" }));

/* Assign Routes to Server */
app.use("/api", Routes);

app.get("/", async (req, res) => {
  res.status(200).send("Connection is good 😊");
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
