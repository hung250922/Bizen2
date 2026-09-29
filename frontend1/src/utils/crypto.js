import CryptoJS from "crypto-js";

export const encrypt = (message, key) => {
    return CryptoJS.AES.encrypt(message, key).toString();
}

export const decrypt = (cipherText, key) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}