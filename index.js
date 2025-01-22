require("dotenv").config();
const app = require("./src/app");
const mongoose = require("./src/config/mongoose.config");

const PORT = process.env.PORT | 3000;

let server;
server = app.listen(PORT, ()=>{
    console.log("Server started on Port 3000");
});

const exitHandler = () =>{
    if(server){
        //first close the server
        server.close(()=>{
            console.log("Shutting down server");
        });
        process.exit(1);
    }
    else process.exit(1);
}

const unexpectedErrorHandler = (error) =>{
    console.log(error);
    exitHandler();
}

process.on('unhandledRejection', unexpectedErrorHandler);
process.on('uncaughtException', unexpectedErrorHandler);