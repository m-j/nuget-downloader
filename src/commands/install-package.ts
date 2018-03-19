import * as util from "util";
import {createReadStream, createWriteStream, readFile} from "fs";
import {createDeflate} from "zlib";
import {join} from "path";
import {AxiosInstance} from "axios";

const extract = require('extract-zip')
const extractAsync = util.promisify(extract);

const DOMParser = require('xmldom').DOMParser;
const readFileAsync = util.promisify(readFile);
const tmp = require('tmp');

export interface NuspecData {
    version: string,
    id: string
}

export async function readNuspecFile(path: string) : Promise<NuspecData>{
    let fileContents = await readFileAsync(path, {encoding: 'utf-8'});

    let doc = new DOMParser().parseFromString(fileContents);
    let versionElement = doc.getElementsByTagName('version').item(0);
    let idElement = doc.getElementsByTagName('id').item(0);

    if(!(versionElement && idElement)){
        throw new Error(`Cannot find version and id in file ${path}`);
    }

    let version = versionElement.firstChild.nodeValue;
    let id = idElement.firstChild.nodeValue;

    return {
        version,
        id
    }
}

export async function downloadFile(targetPath: string, uri: string, axiosInstance: AxiosInstance){
    let response = await axiosInstance.get(uri, {responseType: 'stream'});
    response.data
        .pipe(createWriteStream(targetPath));

    return new Promise((resolve, reject) => {
        response.data
            .on('end', ()=> {
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    })
}

async function createTempPath() : Promise<string> {
    return new Promise<string>((resolve, reject) => {
        tmp.tmpName(function (err, path) {
            if (err) {
                reject(err);
                return;
            }

            resolve(path);
        });
    });
}

export async function installPackage(targetPath: string, packageName: string, packageVersion: string, axiosInstance: AxiosInstance){
    let tmpPath = await createTempPath();

    console.log(`Downloading package ${packageName}#${packageVersion} to ${tmpPath} temp file...`);

    try {
        await downloadFile(tmpPath, 'https://external.loki.thunderpick.com/repository/nuget-hosted/Thunderpick.Web/0.10.376', axiosInstance);
    }
    catch(ex){
        console.error(`Error while downloading file ${ex}`);
    }

    let zipDir = join(targetPath, packageName);

    console.log(`Installing package to ${zipDir}...`);

    try {

    }
    catch(ex){
        console.error(`Error while installing file.`)
    }
    await extractAsync(tmpPath, {dir: zipDir});
    console.log(`Package ${packageName}#${packageVersion} installed.`);
}