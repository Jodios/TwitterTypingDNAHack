import express from 'express';
import figlet from "figlet";
import twitter from "./controllers/TwitterController";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json())
const port = 82;

twitter(app);

app.listen(port, () => {

    figlet("Twitter-TypeDNA", (err, data) => {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        console.log(`running on port ${port}`)
    })

});