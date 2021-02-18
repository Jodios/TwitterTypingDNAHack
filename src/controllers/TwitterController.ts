import express from "express";
import { Socket } from "socket.io";
import { paths } from "../config/Config";
import { login as twitterLogin, getAccessToken, getFeed, postTweet } from "../services/TwitterService";
import { Server } from "socket.io";


export default function HomeController(app: express.Application, socket: Server){

    app.post(paths.TWITTER_LOGIN, twitterLogin);

    app.post(paths.TWITTER_ACCESS, getAccessToken);

    app.post(paths.TWITTER_POST_TWEET, postTweet);

    socket.on("connection", async (sock: Socket) => {
        try{
            socket.emit("connect", "Client Connected")
            getFeed(socket);
        }catch(error){
            socket.emit("authError", "Failed to connect :(")
        }
    })

}