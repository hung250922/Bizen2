const CryptoJS = require("crypto-js");

exports = module.exports = {};

exports.encrypt = (message, key) => {
    return CryptoJS.AES.encrypt(message, key).toString();
}

exports.decrypt = (cipherText, key) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}