/**
 * Encrypt some text using AES 128.
 *
 * @param  {string} data     Content to be encrypted.
 * @param  {string} password Password used for encryption.
 * @return {string}          Encrypted text.
 */
function encrypt(data, password) {
    return sjcl.encrypt(password, data);
}

/**
 * Decrypt some text using AES 128.
 *
 * @param  {string} data     Encypted text.
 * @param  {string} password Password used in encryption.
 * @return {string}          Clear text, decrypted.
 */
function decrypt(data, password) {
    return sjcl.decrypt(password, data);
}
