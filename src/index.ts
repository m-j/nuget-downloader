import axios from 'axios';
import * as https from 'https';
import * as xmljs from 'xml-js';
import * as util from 'util';
import {readFile} from "fs";
import {homedir} from "os";
import {join} from "path";

const readFileAsync = util.promisify(readFile);

async function main(){
    // let resp = await axios.get('https://external.loki.thunderpick.com', {
    //     auth: {
    //         username: 'x',
    //         password: 'x'
    //     },
    //     httpsAgent: new https.Agent({ rejectUnauthorized: false}),
    // });

    // console.log(resp.data);

    const nugetConfigPath = 'C:\\Users\\mathix\\Tmp\\nuget.config';

    const fileContents = await readFileAsync(nugetConfigPath, {encoding: 'utf-8'});
    const xmlAsJs = xmljs.xml2js(fileContents);

    console.log(JSON.stringify(xmlAsJs, null, ' '));

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
    })

    console.log(sourcesDictionary);

}

main();