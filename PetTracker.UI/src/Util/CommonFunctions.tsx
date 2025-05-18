import cloneDeep from 'lodash/cloneDeep';

export const deepClone = (obj) =>
{
    const ret = cloneDeep(obj);
    return ret;
}