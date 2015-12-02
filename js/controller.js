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

    // handle click on saven button
    $('#saveBtn').click(function() {
        clearText = $('#contentArea').val();
        cipheredText = scrypto.encrypt(clearText, module.password.value);
        gdrive.save(cipheredText)
        .then(function() {
            $('#contentArea').val('Saved');
        });
    })

    // handle click on generate button
    $('#generateBtn').click(function() {
        // generate new password
        var passwd = scrypto.generate();
        // get field, value and scroll position
        var field = $('#contentArea');
        var oldValue = field.val();
        // replace selected text with new password
        var scrollPos = field.scrollTop();
        var startPos = field.prop('selectionStart');
        var endPos = field.prop('selectionEnd');
        field.val(oldValue.substring(0, startPos) + passwd + oldValue.substring(endPos, oldValue.length));
        // select the inserted password
        field.focus();
        field.prop('selectionStart', startPos);
        field.prop('selectionEnd', startPos + passwd.length);
        // copy new password to clipboard
        document.execCommand('copy');
        // adjust scroll position
        field.scrollTop(scrollPos);
    });

    global.controller = module;
})(this);
