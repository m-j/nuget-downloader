import axios from 'axios';
import * as https from 'https';

async function main(){
    let resp = await axios.get('https://external.loki.thunderpick.com', {
        auth: {
            username: 'x',
            password: 'x'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false}),
    });

    console.log(resp.data);
}

main();