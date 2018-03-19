import {AxiosInstance} from "axios";
import {getNewsetVersion} from "./get-newest-version";
import {compareSemver} from "../utils/compare-semver";

export async function isNewerVersionAvailable(packageName : string, currentVersion: string, axiosInstance: AxiosInstance){
    let newestVersion = await getNewsetVersion(packageName, axiosInstance);
    return compareSemver(newestVersion, currentVersion) > 0;
}