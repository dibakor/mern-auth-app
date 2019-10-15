const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require('cors');
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
require("dotenv").config();
const path = require("path")

app.use(cors());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
//console.log("URLLLLLL",db);
// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use(express.static(path.join(__dirname, "client")))
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client","index.html"));
});
app.listen(port, () => console.log(`Server up and running on port ${port} !`));