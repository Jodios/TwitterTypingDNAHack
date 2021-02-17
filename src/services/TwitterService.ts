import twit from "twit";
import { vars, urls } from "../config/Config";
import { OAuth } from "../utils/Oauth";
import axios, { AxiosError } from "axios";
import express from "express";
import socket, { Socket, Server } from "socket.io";
import request from "request"

const callbackUrl = "http://127.0.0.1:8080/twitter/callback";
let timeout = 0;

export const login = async (req: express.Request, res: express.Response) => {
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

export const test = async (req: express.Request, res: express.Response) => {
    const config = {
        url: urls.TWITTER_STREAM,
        auth: {
            bearer: vars.twitterBearerToken
        },
        timeout: 31000
    };
    const stream = request.get(config);

    stream.on("data", (data) => {
        try {
            const json = JSON.parse(data.toString());
            if (json.connection_issue) {
                res.status(500);
                res.send({
                    message: "BAD",
                    data: json
                });
            } else {
                res.send({
                    message: "Made it",
                    data: json
                });
            }
        } catch (e) {
            res.send({
                message: "error in outer try",
                error: e
            });
        }
    })
}

export const getFeed = async (socket: Server) => {
    const config = {
        url: urls.TWITTER_STREAM,
        auth: {
            bearer: vars.twitterBearerToken
        },
        timeout: 31000
    };
    try{
        const stream = request.get(config);

        stream.on("data", (data) => {
            try {
              const json = JSON.parse(data.toString());
              if (json.connection_issue) {
                socket.emit("error", json);
                reconnect(stream, socket);
              } else {
                if (json.data) {
                  socket.emit("tweet", json);
                } else {
                  socket.emit("authError", json);
                }
              }
            } catch (e) {
              socket.emit("heartbeat");
            }
        })
    }catch(err){
        socket.emit("authError", "Failed to connect");
    }
}

const reconnect = async (stream, socket) => {
    timeout++;
    stream.abort();
    await sleep(2 ** timeout * 1000);
    getFeed(socket);
};

const sleep = async (delay) => {
    return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

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