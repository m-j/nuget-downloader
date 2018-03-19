import axios, {AxiosInstance} from "axios";
import {INugetConfig, readAndParseConfig} from "../utils/config-parser";
import * as https from "https";

var DOMParser = require('xmldom').DOMParser;

export async function getNewesetVersion(packageName: string, axiosInstance: AxiosInstance){
    let response = await axiosInstance.get(`/Search()?$filter=IsLatestVersion&$orderby=Id&searchTerm=%27${packageName}%27&targetFramework=%27%27&includease=false&$skip=0&$top=30`);

    let doc = new DOMParser().parseFromString(response.data);
    let element = doc.getElementsByTagName('d:Version').item(0);

    if(element.childNodes.length == 1){
        return element.firstChild.nodeValue;
    }
    else {
        return;
    }
}

export async function latestCommand(argv){
    const nugetConfigPath = 'C:\\Users\\mathix\\Tmp\\nuget.config';
    const sourceName = 'loki';


    let config : INugetConfig = await readAndParseConfig(nugetConfigPath);

    let source = config.sourcesDictionary[sourceName];

    let axiosInstance = axios.create({
        baseURL: source.uri,
        auth: {
            username: source.credentials.username,
            password: source.credentials.password
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false}),
    });

    let newestVersion = await getNewesetVersion(argv.id, axiosInstance);
    console.log(newestVersion);
}