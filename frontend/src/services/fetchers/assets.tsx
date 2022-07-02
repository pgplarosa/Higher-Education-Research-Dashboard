import { STATIC_ROOT } from '../http/routes';

export const getAssetAddress = (filename: string) => {
    return STATIC_ROOT + filename;
};
