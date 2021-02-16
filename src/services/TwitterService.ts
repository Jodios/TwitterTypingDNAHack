import twit from "twit";
import { vars, urls } from "../config/Config";
import { OAuth } from "../utils/Oauth";
import axios, { AxiosError } from "axios";
import express from "express";

const callbackUrl = "http://127.0.0.1:8080/twitter/callback";

export const login = async () => {
    let oauth = new OAuth(urls.TWITTER_REQUEST_TOKEN, vars.twitterAccessToken, vars.twitterAccessTokenSecret, vars.twitterKey, vars.twitterSecret, callbackUrl);
    console.log(oauth.getAuthHeader())
    axios.post(urls.TWITTER_REQUEST_TOKEN, {}, {
        headers: {
            Authorization: oauth.getAuthHeader()
        }
    }).then(resp => {
        console.log(resp.data);
    }).catch((err: AxiosError) => {
        console.log(err.request);
    })
}

export const getAccessToken = async (req: express.Request, res: express.Response) => {
    var oauth_token = req.body.oauth_token;
    var oauth_verifier = req.body.oauth_verifier;
    if (oauth_token == null || oauth_verifier == null) {
        res.status(400);
        res.send({
            message: "MISSING TOKEN OR VERIFIER"
        })
    }
    axios.post(`${urls.TWITTER_ACCESS_TOKEN}/?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`)
        .then((axiosResponse) => {
            console.log(axiosResponse.data);
            res.status(axiosResponse.status);
            let data = {}
            axiosResponse.data.toString().split("&").forEach(keyValueString => {
                let keyValueList = keyValueString.split("=");
                data[keyValueList[0]] = keyValueList[1];
            });
            res.send(data);
        }).catch((err: AxiosError) => {
            console.log(err.message);
            res.status(err.response.status)
            res.send(err.response.data);
        })
}

export const getFeed = async (req: express.Request, res: express.Response) => {
    var oauth_token = req.body.oauth_token;
    var oauth_token_secret = req.body.oauth_token_secret;
    const twitClient = new twit({
        consumer_key: vars.twitterKey,
        consumer_secret: vars.twitterSecret,
        access_token: oauth_token,
        access_token_secret: oauth_token_secret
    })
    twitClient.get("", (err, result, response) => {

    })
    res.end();
}

export const postTweet = async (req: express.Request, res: express.Response) => {
    var oauth_token = req.body.oauth_token;
    var oauth_token_secret = req.body.oauth_token_secret;
    const twitClient = new twit({
        consumer_key: vars.twitterKey,
        consumer_secret: vars.twitterSecret,
        access_token: oauth_token,
        access_token_secret: oauth_token_secret
    })
    twitClient.post(`${urls.TWITTER_UPDATE_STATUS}?status=${encodeURIComponent(req.body.tweet)}`, (err, result, response) => {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            console.log(result);
            console.log(response);
        }
        res.end();
    })
}