import axios, { AxiosResponse } from "axios";
import express from "express";
import { Socket } from "socket.io";
import { paths, urls } from "../config/Config";
import { onAxiosError } from "../errors/ErrorHandler";
import { login as twitterLogin, getAccessToken, getFeed, postTweet } from "../services/TwitterService";


export default function HomeController(app: express.Application, socket: Socket){

    app.post(paths.TWITTER_LOGIN, twitterLogin);

    app.post(paths.TWITTER_ACCESS, getAccessToken);

    app.post(paths.TWITTER_POST_TWEET, postTweet);

    socket.on("connection", async (sock) => {
        try{
            socket.emit("connect", "Client Connected")
            getFeed(socket);
        }catch(error){
            socket.emit("authError", "Failed to connect :(")
        }
    })

}