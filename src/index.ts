import axios from 'axios';
import * as https from 'https';
import {INugetConfig, readAndParseConfig} from "./config-parser";
import {getNewsetVersion} from "./commands/get-newest-version";
import {isNewerVersionAvailable} from "./commands/is-newer-version-available";


async function main(){


    const nugetConfigPath = 'C:\\Users\\mathix\\Tmp\\nuget.config';
    const sourceName = 'loki';

    let config : INugetConfig = await readAndParseConfig(nugetConfigPath);

    let source = config.sourcesDictionary[sourceName];

    console.log(`Requesting ${source.uri}`);

    // https://external.loki.thunderpick.com/repository/nuget-hosted/Search()?$filter=IsLatestVersion&$orderby=Id&searchTerm=%27Thunderpick.Web%27&targetFramework=%27%27&includease=false&$skip=0&$top=30

    let axiosInstance = axios.create({
        baseURL: source.uri,
        auth: {
            username: source.credentials.username,
            password: source.credentials.password
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false}),
    });

    // let resp = await axiosInstance.get('/');

    // console.log(resp.data);

    let available = await isNewerVersionAvailable('Thunderpick.Web', '0.10.377', axiosInstance);
    console.log(`Newer version available ${available}`);
}

main();