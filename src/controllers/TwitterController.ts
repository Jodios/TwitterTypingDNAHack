import axios, { AxiosResponse } from "axios";
import express from "express";
import { paths, urls } from "../config/Config";
import { onAxiosError } from "../errors/ErrorHandler";
import { login as twitterLogin, getAccessToken, getFeed, postTweet } from "../services/TwitterService";


export default function HomeController(app: express.Application){

    app.post(paths.TWITTER_LOGIN, async (req: express.Request, res: express.Response) => {
        
        await twitterLogin();
        res.end();
    })

    app.post(paths.TWITTER_ACCESS, getAccessToken);

    app.post(paths.TWITTER_FEED, getFeed);

    app.post(paths.TWITTER_POST_TWEET, postTweet)

}