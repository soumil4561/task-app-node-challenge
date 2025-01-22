const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require('helmet')
const routes = require("./routes/api");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport.config");

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/api",routes);

module.exports = app;