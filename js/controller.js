(function(global) {
    var module = {};

    /** Password to protected the passwords file. */
    module.password = null;

    module.passwordDeferred = $.Deferred();

    /**
     * Load the value of <code>module.password</code>.
     *
     * This function returns a promise of the value of the password to decrypt
     * the file. The password is asked to the user using a modal.
     *
     * In addition to fullfilling the promise, the password is also set at
     * <code>module.password</code>.
     *
     * @return {Promise} Promise of the password.
     */
    function loadPassword() {
        if (module.password) {
            return Promise.resolve(module.password);
        }
        $('#passwordModal').modal();
        return module.passwordDeferred.promise();
    }

    function enterPassword() {
        module.password = $('#passwordField').val();
        module.passwordDeferred.resolve(module.password);
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

    // put focus on password field when modal appears
    $('#passwordModal').on('shown.bs.modal', function() {
        $('#passwordField').focus();
    });

    $('#passwordEnterBtn').click(enterPassword);
    $('#passwordField').keyup(function(event) {
        if (event.keyCode === 13) {
            $('#passwordModal').modal('hide');
            enterPassword();
        }
    });

    global.controller = module;
})(this);
