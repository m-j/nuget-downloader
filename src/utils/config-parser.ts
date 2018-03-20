import * as xmljs from 'xml-js';
import * as util from 'util';
import {readFile} from "fs";

const readFileAsync = util.promisify(readFile);

export interface INugetCredentials {
    username: string,
    password: string,
}

export interface IConfigSource {
    uri: string,
    credentials: INugetCredentials
}

export interface INugetConfig {
    sourcesDictionary : {
        [get: string] : IConfigSource;
    }
}

export async function readAndParseConfig(path: string) : Promise<INugetConfig> {
    const fileContents = await readFileAsync(path, {encoding: 'utf-8'});
    const xmlAsJs = xmljs.xml2js(fileContents);

    let packageSources = xmlAsJs.elements[0].elements.find(el => el.name == 'packageSources');
    let packageSourceCredentials = xmlAsJs.elements[0].elements.find(el => el.name == 'packageSourceCredentials');

    let sourcesDictionary = {};

    packageSources.elements.forEach(el => {
        sourcesDictionary[el.attributes.key] = {
            uri: el.attributes.value
        }
    });

    packageSourceCredentials.elements.forEach(el => {
        let username, password;

        el.elements.forEach(ell => {
            if(ell.attributes.key == 'Username'){
                username = ell.attributes.value;
            }
            else if(ell.attributes.key == 'ClearTextPassword') {
                password = ell.attributes.value;
            }
        });

        sourcesDictionary[el.name].credentials = {username, password};
    });

    let config : any = {
        sourcesDictionary
    };

    return config as INugetConfig;
}