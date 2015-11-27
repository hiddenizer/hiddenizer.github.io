(function(global) {
    var module = {};

    /** Password to protected the passwords file. */
    module.password = null;

    module.passwordDeferred = null;

    var loadPassword = function() {
        if (module.password) {
            return Promise.resolve(module.password);
        }
        return $.Deferred(function(deferred) {
            module.passwordDeferred = deferred;
            $('#passwordModal').modal();
        });
    }

    // handle click on load button
    $('#loadBtn').click(function(argument) {
        loadPassword()
        .then(gdrive.load)
        .then(function(cipheredText) {
            clearText = scrypto.decrypt(cipheredText, module.password);
            $('#contentArea').val(clearText);
        });
    });

    global.controller = module;
})(this);
