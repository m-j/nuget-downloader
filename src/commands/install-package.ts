import * as util from "util";
import {createWriteStream, readFile} from "fs";
import {join} from "path";
import {AxiosInstance} from "axios";
import {buildAxiosInstance} from "../utils/build-axios-instance";
import {getNewesetVersion} from "./latest";

const extract = require('extract-zip')
const extractAsync = util.promisify(extract);

const DOMParser = require('xmldom').DOMParser;
const readFileAsync = util.promisify(readFile);
const tmp = require('tmp');
const rimrafAsync = util.promisify(require('rimraf'));

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

export async function installPackage(targetPath: string, packageId: string, packageVersion: string, axiosInstance: AxiosInstance){
    let tmpPath = await createTempPath();

    console.log(`Downloading package ${packageId}#${packageVersion} to ${tmpPath} temp file...`);

    try {
        await downloadFile(tmpPath, `${packageId}/${packageVersion}`, axiosInstance);
    }
    catch(ex){
        console.error(`Error while downloading file ${ex}`);
    }

    let zipDir = join(targetPath, packageId);

    console.log(`Installing package to ${zipDir}...`);

    try {
        await extractAsync(tmpPath, {dir: zipDir});
    }
    catch(ex){
        console.error(`Error while installing file.`)
    }
    console.log(`Package ${packageId}#${packageVersion} installed.`);
}

export async function installPackageCommand(argv){
    let axiosInstance =  await buildAxiosInstance(argv.source, argv.config);
    let version = argv.pversion;

    if(argv.clean){
        try {
            let dirToRemove = join(argv.path, argv.id);
            console.log(`Removing dir ${dirToRemove}...`)
            await rimrafAsync(dirToRemove);
        }
        catch(err){
            console.error(err);
            return;
        }
    }

    if(!version){
        version = await getNewesetVersion(argv.id, axiosInstance);
        console.log('No version provided. Installing latest.')
    }

    await installPackage(argv.path, argv.id, version, axiosInstance);
}
