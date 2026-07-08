import CryptoJS from 'crypto-js';

export const md5Hash = (text: string): string => {
    return CryptoJS.MD5(text).toString();
};
