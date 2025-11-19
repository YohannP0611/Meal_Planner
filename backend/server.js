require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/ingredients", require("./routes/ingredients"));
app.use("/api/recipes", require("./routes/recipes"));

app.listen(3000, () => console.log("Backend running on port 3000"));