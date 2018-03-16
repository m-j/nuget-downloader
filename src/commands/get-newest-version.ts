import {AxiosInstance} from "axios";
import {xml2js} from "xml-js";

var xpath   = require('xpath');
var DOMParser     = require('xmldom').DOMParser;

export async function getNewsetVersion(packageName: string, axiosInstance: AxiosInstance){
    let response = await axiosInstance.get(`/Search()?$filter=IsLatestVersion&$orderby=Id&searchTerm=%27${packageName}%27&targetFramework=%27%27&includease=false&$skip=0&$top=30`);

    let doc = new DOMParser().parseFromString(response.data);
    let element = doc.getElementsByTagName('d:Version').item(0);

    if(element.childNodes.length == 1){
        return element.firstChild.nodeValue;
    }
    else {
        return;
    }

    // console.log(element);
    // let element = xpath.select('//m:properties/d:Version');
    // console.log(element);
}