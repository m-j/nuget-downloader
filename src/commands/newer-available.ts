import {AxiosInstance} from "axios";
import {getNewesetVersion} from "./latest";
import {compareSemver} from "../utils/compare-semver";

export async function isNewerVersionAvailable(packageName : string, currentVersion: string, axiosInstance: AxiosInstance){
    let newestVersion = await getNewesetVersion(packageName, axiosInstance);
    return compareSemver(newestVersion, currentVersion) > 0;
}

export async function newerAvailableCommand(argv, axiosInstance: AxiosInstance){

}