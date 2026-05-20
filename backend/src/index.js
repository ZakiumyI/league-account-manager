require("dotenv").config();
console.log("RIOT API KEY:", process.env.RIOT_API_KEY);


const express = require("express");
const cors = require("cors");

require("./db/database");

const accountRoutes = require("./routes/accountRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "League Account Manager API"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});