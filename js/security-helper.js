// encrypt the content
function encrypt(data, password) {
    return sjcl.encrypt(password, data);
}

// decrypt the content
function decrypt(data, password) {
    return sjcl.decrypt(password, data);
}
