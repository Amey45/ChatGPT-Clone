  const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");

dotenv.config();
const url =
  "mongodb+srv://ameyswami45:jdZg2kugIDPOJ3fs@swamidb.szrsc0v.mongodb.net/chatgpt-clone";

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB Connected!".bgMagenta);
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB".bgRed + err);
  });

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "CHATGPT SERVER OK" });
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`.bgCyan);
});
  