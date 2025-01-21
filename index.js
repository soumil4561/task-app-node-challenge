require("dotenv").config();
const app = require("./src/app");
const mongoose = require("./src/config/mongoose.config");

const PORT = process.env.PORT | 3000;

app.listen(PORT, ()=>{
    console.log("Server started on Port 3000");
});