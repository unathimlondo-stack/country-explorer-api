const http = require ("http")
const fs = require("fs")
const handleRequest = require("./controller")

const server = http.createServer(handleRequest);
const PORT = 3000;  
server.listen(PORT, function() {
    console.log ("Server is listening http://localhost:" + PORT);
});
