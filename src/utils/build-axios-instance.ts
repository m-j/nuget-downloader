import {INugetConfig, readAndParseConfig} from "./config-parser";
import axios, {AxiosInstance} from "axios";
import * as https from "https";
import {homedir} from "os";
import {join} from "path";

export async function buildAxiosInstance(sourceName: string, nugetConfigPath?: string){
    if(!nugetConfigPath){
        nugetConfigPath = join(homedir(), '.nuget\\nuget.config');
    }

    let config : INugetConfig = await readAndParseConfig(nugetConfigPath);

    let source = config.sourcesDictionary[sourceName];

    if(!source){
        throw new Error(`Source ${sourceName} doesn't exist in ${nugetConfigPath}`);
    }

    let axiosInstance = axios.create({
        baseURL: source.uri,
        auth: {
            username: source.credentials.username,
            password: source.credentials.password
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false}),
    });

    return axiosInstance;
}