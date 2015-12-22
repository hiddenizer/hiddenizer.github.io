angular
.module('shadownizerApp')
.factory('scrypto', [function() {
    var module = {};

    // characters for a randomly generated password
    var pwdSafeLetters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var pwdUnsafeLetters = " !#$%&)*+,-./:;<=>?@]^_`|}";
    var pwdAllLetters = pwdSafeLetters + pwdUnsafeLetters;

    /** Random numbers generator. */
    module.prng = sjcl.random;

    // start adding entropy to PRNG
	module.prng.startCollectors();

    /**
     * Encrypt some text using AES 128.
     *
     * @param  {String} data     Content to be encrypted.
     * @param  {String} password Password used for encryption.
     * @return {String}          Encrypted text.
     */
    module.encrypt = function(data, password) {
        return sjcl.encrypt(password, data);
    };

    /**
     * Decrypt some text using AES 128.
     *
     * @param  {string} data     Encypted text.
     * @param  {string} password Password used in encryption.
     * @return {string}          Clear text, decrypted.
     */
    module.decrypt = function(data, password) {
        return sjcl.decrypt(password, data);
    };

    module.generate = function(safeOnly) {
        var letters = safeOnly ? pwdSafeLetters : pwdAllLetters;
        var randNums = module.prng.randomWords(15);
        var randChars = '';
        for (var i = 0; i < randNums.length; i++) {
            var charPos = Math.abs(randNums[i] % letters.length);
            randChars += letters.charAt(charPos);
        }
        return randChars;
    };
    
    return module;
}]);
