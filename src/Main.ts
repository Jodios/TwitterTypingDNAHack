import express from 'express';
import figlet from "figlet";
import twitter from "./controllers/TwitterController";
import typingDNA from "./controllers/TypingDNAController";
import bodyParser from "body-parser";
import http from "http";
import socketIo, { Server } from "socket.io";

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const port = 8050;
const server = http.createServer(app);
const socketServer: socketIo.Server = new socketIo.Server(server);

twitter(app, socketServer);
typingDNA(app);

app.get("/", (req, res) => {
    res.send({
        STATUS: "UP"
    })
})

app.listen(port, () => {

    figlet("Twitter-TypeDNA", (err, data) => {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        console.log(`running on port ${port}`)
    })

});