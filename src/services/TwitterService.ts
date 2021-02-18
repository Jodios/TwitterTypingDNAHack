import { vars, urls } from "../config/Config";
import axios from "axios";
import express from "express";
import Request from "request";
import { Server } from "socket.io";
import {onAxiosError} from "../errors/ErrorHandler";
import oauth1 from "oauth-1.0a"
import sha1 from "crypto-js/hmac-sha1";
import Base64 from 'crypto-js/enc-base64';
import twitter from "ntwitter";

let timeout = 0;

export const login = async (req: express.Request, res: express.Response) => {
    let callbackUrl = req.query.oauth_callback ? req.query.oauth_callback : "http://127.0.0.1:4200";
    const oauth = new oauth1({
        consumer: { key: vars.twitterKey, secret: vars.twitterSecret },        
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return Base64.stringify(sha1(base_string, key))
        },
    })
    let x = oauth.authorize({
        url: urls.TWITTER_REQUEST_TOKEN,
        method: "POST",
        includeBodyHash: false,
        data: {
            oauth_callback: callbackUrl
        }
    })
    let header = oauth.toHeader(x);
    axios.post(urls.TWITTER_REQUEST_TOKEN, undefined, {
        headers: {
            Authorization: header["Authorization"]
        }
    }).then((response) => {
        res.status(response.status);
        let tokenSecret = response.data.split("&")
        let token = tokenSecret[0].split("=")[1]
        let secret = tokenSecret[1].split("=")[1]
        let callbackConfirmed = tokenSecret[2].split("=")[1]
        let data = {
            oauth_token: token,
            oauth_token_secret: secret,
            callback_confirmed: callbackConfirmed
        }
        console.log(`GOT REQUEST TOKEN`);
        res.send(data);
    }).catch(err => onAxiosError(err, res))

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
        }).catch(err => onAxiosError(err, res))
}

export const getFeed = async (socket: Server) => {
    let client = new twitter()
}

export const postTweet = async (req: express.Request, res: express.Response) => {
    var oauth_token = req.body.oauth_token;
    var oauth_token_secret = req.body.oauth_token_secret;
    var tweet = req.body.tweet;
    const oauth = new oauth1({
        consumer: { key: vars.twitterKey, secret: vars.twitterSecret },        
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return Base64.stringify(sha1(base_string, key))
        },
    })
    let x = oauth.authorize({
        url: `${urls.TWITTER_UPDATE_STATUS}?include_entities=true`,
        method: "POST",
        includeBodyHash: false,
        data: {
            status: tweet
        }
    },{ key: oauth_token, secret: oauth_token_secret})
    let header = oauth.toHeader(x);

    axios.post(`${urls.TWITTER_UPDATE_STATUS}?include_entities=true`, `status=${encodeURIComponent(tweet).replace(/[!'()*]/g, escape)}`, {
        headers: {
            Authorization: header["Authorization"]
        }
    }).then((response) => {
        res.status(response.status);
        console.log(`POSTING TWEET`);
        res.send(response.data);
    }).catch(err => onAxiosError(err, res))


    
}

const reconnect = async (stream, socket) => {
    timeout++;
    stream.abort();
    await sleep(2 ** timeout * 1000);
    getFeed(socket);
}

const sleep = async (delay) => {
    return new Promise((resolve) => setTimeout(() => resolve(true), delay));
}