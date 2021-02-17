import axios, { AxiosResponse } from "axios";
import express from "express";
import { Socket } from "socket.io";
import { paths, urls } from "../config/Config";
import { onAxiosError } from "../errors/ErrorHandler";
import { login as twitterLogin, getAccessToken, getFeed, postTweet, test } from "../services/TwitterService";
import { Server } from "socket.io";


export default function HomeController(app: express.Application, socket: Server){

    app.post(paths.TWITTER_LOGIN, twitterLogin);

    app.post(paths.TWITTER_ACCESS, getAccessToken);

    app.post(paths.TWITTER_POST_TWEET, postTweet);

    app.post("/test", test);

    socket.on("connection", async (sock) => {
        try{
            socket.emit("connect", "Client Connected")
            getFeed(socket);
        }catch(error){
            socket.emit("authError", "Failed to connect :(")
        }
    })

}