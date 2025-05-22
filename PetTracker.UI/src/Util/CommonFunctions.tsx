import cloneDeep from 'lodash/cloneDeep';

export const deepClone = (obj) =>
{
    const ret = cloneDeep(obj);
    return ret;
}

export const getImageUrlFromBlob = (base64String: string) => {
    return `data:image/png;base64,${base64String}`;
}