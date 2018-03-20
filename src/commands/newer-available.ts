import {AxiosInstance} from "axios";
import {getNewesetVersion} from "./latest";
import {compareSemver} from "../utils/compare-semver";
import {buildAxiosInstance} from "../utils/build-axios-instance";
import {readNuspecFile} from "./install-package";
import {join} from "path";

export async function isNewerVersionAvailable(packageId : string, currentVersion: string, axiosInstance: AxiosInstance){
    let newestVersion = await getNewesetVersion(packageId, axiosInstance);
    return compareSemver(newestVersion, currentVersion) > 0;
}

export async function newerAvailableCommand(argv){
    let axiosInstance =  await buildAxiosInstance(argv.source, argv.config);
    let nuspecData = await readNuspecFile(join(argv.path, argv.id, argv.id + '.nuspec'));

    let isNewerAvailable = await isNewerVersionAvailable(argv.id, nuspecData.version, axiosInstance);

    if(isNewerAvailable){
        console.log('true');
    }
    else {
        console.log('false');
    }
}