(function(global) {
    var module = {};

    /** Password's value and resolve function. */
    module.password = {
        value: null,
        resolve: null,
    };

    /**
     * Load the password.
     *
     * The password is asked to the user using a modal. The password is also set
     * at <code>module.password.value</code>.
     *
     * @return {Promise} Password's promise.
     */
    function loadPassword() {
        $('#passwordModal').modal();
        return new Promise(function(resolve, reject) {
            module.password.resolve = resolve;
        });
    }

    /**
     * Resolve the password's promise with the value from
     * <code>passwordField</code>.
     */
    function enterPassword() {
        module.password.value = $('#passwordField').val();
        module.password.resolve(module.password);
    }

    // handle click on load button
    $('#loadBtn').click(function(argument) {
        loadPassword()
        .then(gdrive.load)
        .then(function(cipheredText) {
            clearText = scrypto.decrypt(cipheredText, module.password.value);
            $('#contentArea').val(clearText);
        });
    });

    // put focus on password field when modal appears
    $('#passwordModal').on('shown.bs.modal', function() {
        $('#passwordField').focus();
    });

    // resolve the password's promise on 'enter' at password's modal
    $('#passwordEnterBtn').click(enterPassword);
    $('#passwordField').keyup(function(event) {
        if (event.keyCode === 13) {
            $('#passwordModal').modal('hide');
            enterPassword();
        }
    });

    global.controller = module;
})(this);
