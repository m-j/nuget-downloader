import {AxiosInstance} from "axios";
import {buildAxiosInstance} from "../utils/build-axios-instance";

var DOMParser = require('xmldom').DOMParser;

export async function getNewesetVersion(packageId: string, axiosInstance: AxiosInstance){
    let response = await axiosInstance.get(`/Search()?$filter=IsLatestVersion&$orderby=Id&searchTerm=%27${packageId}%27&targetFramework=%27%27&includease=false&$skip=0&$top=30`);

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
    let axiosInstance =  await buildAxiosInstance(argv.source, argv.config);
    let newestVersion = await getNewesetVersion(argv.id, axiosInstance);
    console.log(newestVersion);
}