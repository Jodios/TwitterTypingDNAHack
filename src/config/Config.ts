
import dotenv from "dotenv";

dotenv.config();
const twitter_base_url = "https://api.twitter.com";
const typingDNA_base_url = "https://api.typingdna.com";

export const paths = {
    TWITTER_LOGIN: "/twitter/login",
    TWITTER_ACCESS: "/twitter/getAccess",
    TWITTER_FEED: "/twitter/feed",
    TWITTER_POST_TWEET: "/twitter/postTweet",
    TYPING_DNA_VERIFY: "/typingdna",
    TYPING_DNA_GET_USER: "/typingdna/getUser",
    TYPING_DNA_DELETE_USER: "/typingdna/deleteUser"
}

export const urls = {
    TWITTER_REQUEST_TOKEN: twitter_base_url + "/oauth/request_token",
    TWITTER_ACCESS_TOKEN: twitter_base_url + "/oauth/access_token",
    TWITTER_UPDATE_STATUS: twitter_base_url + "/1.1/statuses/update.json",
    TWITTER_STREAM: twitter_base_url + "/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id",
    TWITTER_RULES: twitter_base_url + "/2/tweets/search/stream/rules",

    TYPING_DNA_AUTO: typingDNA_base_url + "/auto",
    TYPING_DNA_USER: typingDNA_base_url + "/user"
}

export const vars = {
    twitterKey: process.env.twitterKey,
    twitterSecret: process.env.twitterSecret,
    twitterAccessToken: process.env.twitterAccessToken,
    twitterAccessTokenSecret: process.env.twitterAccessTokenSecret,
    twitterBearerToken: process.env.twitterBearerToken,
    typingDNAKey: process.env.typingDNAKey,
    typingDNASecret: process.env.typingDNASecret
}

export const errMessages = {
    NO_TYPING_DNA_ID: {message: "A user ID is required.", code: 400},
    NO_TYPING_DNA_TP: {message: "A user Typing Pattern is required.", code: 400},
    MISSING_TYPING_DNA_INFO: {message: "Either user ID or Typing Pattern is missing.", code: 400}    
}


