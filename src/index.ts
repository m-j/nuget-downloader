import axios, {AxiosInstance} from 'axios';
import * as https from 'https';
import {INugetConfig, readAndParseConfig} from "./utils/config-parser";
import {getNewsetVersion} from "./commands/get-newest-version";
import {isNewerVersionAvailable} from "./commands/is-newer-version-available";
import {installPackage, readNuspecFile} from "./commands/install-package";

async function checkForNewerVersion(axiosInstance: AxiosInstance){
    let available = await isNewerVersionAvailable('Thunderpick.Web', '0.10.377', axiosInstance);
    console.log(`Newer version available ${available}`);
}

async function main(){


    const nugetConfigPath = 'C:\\Users\\mathix\\Tmp\\nuget.config';
    const sourceName = 'loki';

    let config : INugetConfig = await readAndParseConfig(nugetConfigPath);

    let source = config.sourcesDictionary[sourceName];

    // await checkForNewerVersion(axiosInstance);

        // https://external.loki.thunderpick.com/repository/nuget-hosted/Search()?$filter=IsLatestVersion&$orderby=Id&searchTerm=%27Thunderpick.Web%27&targetFramework=%27%27&includease=false&$skip=0&$top=30

    let axiosInstance = axios.create({
        baseURL: source.uri,
        auth: {
            username: source.credentials.username,
            password: source.credentials.password
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false}),
    });

    // let nuspecData = await readNuspecFile('c:\\Users\\mathix\\Downloads\\Thunderpick.Web.0.10.376\\Thunderpick.Web.nuspec');

    await installPackage('C:\\Users\\mathix\\Tmp\\zlib', 'Thunderpick.Web', '0.10.376', axiosInstance);

}

main();