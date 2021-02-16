
import dotenv from "dotenv";

dotenv.config();
const twitter_base_url = "https://api.twitter.com";

export const paths = {
    TWITTER_LOGIN: "/twitter/login",
    TWITTER_ACCESS: "/twitter/getAccess",
    TWITTER_FEED: "/twitter/feed",
    TWITTER_POST_TWEET: "/twitter/postTweet"
}

export const urls = {
    TWITTER_REQUEST_TOKEN: twitter_base_url + "/oauth/request_token",
    TWITTER_ACCESS_TOKEN: twitter_base_url + "/oauth/access_token",
    TWITTER_UPDATE_STATUS: twitter_base_url + "/1.1/statuses/update.json",
    TWITTER_STREAM: twitter_base_url + "/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id",
    TWITTER_RULES: twitter_base_url + "/2/tweets/search/stream/rules"
}

export const vars = {
    twitterKey: process.env.twitterKey,
    twitterSecret: process.env.twitterKey,
    twitterAccessToken: process.env.twitterAccessToken,
    twitterAccessTokenSecret: process.env.twitterAccessTokenSecret,
    twitterBearerToken: process.env.twitterBearerToken,
    typingDNAKey: process.env.typingDNAKey,
    typingDNASecret: process.env.typingDNASecret
}


