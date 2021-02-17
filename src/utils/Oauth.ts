// OAuth 
// oauth_consumer_key="CSl3CsrjnHQLxYfaP3hSBtHIa",
// oauth_signature_method="HMAC-SHA1",
// oauth_timestamp="1613434521",
// oauth_nonce="LIAaDZiAAMp",
// oauth_version="1.0",
// oauth_signature="twGQi07SITVbOnl8s6fvdxH1Xjg%3D"

// OAuth 
// oauth_consumer_key="CSl3CsrjnHQLxYfaP3hSBtHIa",
// oauth_signature_method="HMAC-SHA1",
// oauth_timestamp="26890732852",
// oauth_nonce="eCj7q184Ql2+PBkq7WJjDw==",
// oauth_version="1.0",
// oauth_signature="X/cTyED1jVJJzxns0gjCxz7ici8="
import crypto from "crypto";

export class OAuth {

    private AUTHENTICATION_HEADER;
    private OAUTH_SIGNATURE;
    private SIG_METHOD = "HMAC-SHA1";
    private OAUTH_VERSION = "1.0";
    private HTTP_METHOD = "POST";
    private NONCE;
    private TIMESTAMP;

    constructor(private requestTokenUrl, private oauthToken, private oauthSecret, private consumerKey, private consumerSecret, private callback) {
        this.callback = encodeURIComponent(callback);
        this.NONCE = this.getNonce();
        this.TIMESTAMP = Math.floor(Date.now() / 60);
        this.OAUTH_SIGNATURE = this.generateSignature();
        this.AUTHENTICATION_HEADER = this.getAuthHeader();
    }

    public getAuthHeader = () => {
        return `OAuth `
            + `oauth_consumer_key="${encodeURIComponent(this.consumerKey)}",`
            + `oauth_signature_method="${encodeURIComponent(this.SIG_METHOD)}",`
            + `oauth_timestamp="${encodeURIComponent(this.TIMESTAMP)}",`
            + `oauth_nonce="${encodeURIComponent(this.NONCE)}",`
            + `oauth_version="${encodeURIComponent(this.OAUTH_VERSION)}",`
            + `oauth_callback="${encodeURIComponent(this.callback)}",`
            + `oauth_signature="${encodeURIComponent(this.OAUTH_SIGNATURE)}"`
    }

    private generateSignature = (): string => {
        let params = [];
        let data = {
            oauth_consumer_key: this.consumerKey,
            oauth_signature_method: this.SIG_METHOD,
            oauth_timestamp: this.TIMESTAMP,
            oauth_nonce: this.NONCE,
            oauth_version: this.OAUTH_VERSION,
            oauth_callback: this.callback,
            oauth_token: this.oauthToken
        }
        for (let key in data) {
            params.push(`${encodeURIComponent(key).toString()}=${encodeURIComponent(data[key]).toString()}`)
        }
        
        params = params.sort();
        let paramString = params.join("&");
        console.log(`params === ${params}\n\n`)

        let baseString = `${this.HTTP_METHOD.toUpperCase()}&${encodeURIComponent(this.requestTokenUrl).toString()}&${encodeURIComponent(paramString).toString()}`;
        console.log(`base string = ${baseString}\n\n`)

        let signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(this.oauthSecret)}`
        console.log(`signing key = ${signingKey}\n\n`);

        let signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
        console.log(`signature = ${signature}\n\n`);

        return signature;
    }

    private getNonce = (): string => {
        const length = 9;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var nonce = "";
        for (var i = 0; i < length; i++) {
            nonce += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return nonce;
    }

}