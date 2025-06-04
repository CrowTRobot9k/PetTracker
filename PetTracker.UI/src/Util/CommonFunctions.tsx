import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

export const deepClone = (obj) =>
{
    const ret = cloneDeep(obj);
    return ret;
}

export const getImageUrlFromBlob = (base64String: string) => {
    return `data:image/png;base64,${base64String}`;
}

function isValidDateTime(dateTimeString:string) {
    const momentObj = moment(dateTimeString,"YYYY-MM-DDTHH:mm:ss",true);
    return momentObj.isValid();
}

export const convertDates = (obj:any) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'string' && isValidDateTime(obj[key]))
            {
                obj[key] = moment.utc(obj[key], "YYYY-MM-DDTHH:mm:ss", true).local().toDate();
            } else if (typeof obj[key] === 'object') {
                convertDates(obj[key]);
            }
        }
    }
}