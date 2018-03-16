import {AxiosInstance} from "axios";
import {getNewsetVersion} from "./get-newest-version";

function cmp (a, b) {
    var pa = a.split('.');
    var pb = b.split('.');
    for (var i = 0; i < 3; i++) {
        var na = Number(pa[i]);
        var nb = Number(pb[i]);
        if (na > nb) return 1;
        if (nb > na) return -1;
        if (!isNaN(na) && isNaN(nb)) return 1;
        if (isNaN(na) && !isNaN(nb)) return -1;
    }
    return 0;
};

export async function isNewerVersionAvailable(packageName : string, currentVersion: string, axiosInstance: AxiosInstance){
    let newestVersion = await getNewsetVersion(packageName, axiosInstance);
     return cmp(newestVersion, currentVersion) > 0;
}