angular
.module('shadownizerApp')
.factory('gdrive', [function() {
    var module = {};

    // our google apps ID
    var CLIENT_ID = '780199501376-q7dm26lauueljp43upe0jdt6jje5s255.apps.googleusercontent.com';
    // required permissions
    var SCOPES = ['https://www.googleapis.com/auth/drive'];

    module.fileId = null;

    /**
     * Load the password file's.
     *
     * The Google Drive API is automatically loaded and authorized.
     * The password's file must be named <code>passwords.shadow</code> and only
     * the first one found is retrieved.
     *
     * @return {Promise} Promise for the file's content.
     */
    module.load = function() {
        // authorize app with google drive
        return gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true})
        // load google drive api
        .then(function() {
            return gapi.client.load('drive', 'v2');
        // find the file named 'passwords.shadow'
        }).then(function() {
            var request = gapi.client.drive.files.list({
                q: "title = 'passwords.shadow'",
                fields: 'items(id,title)',
                immediate: true,
            });
            return new Promise(function(resolve, reject) {
                request.execute(resolve);
            });
        // read the file content
        }).then(function(response) {
            return new Promise(function(resolve, reject) {
                var accessToken = gapi.auth.getToken().access_token;
                module.fileId = response.items[0].id;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://www.googleapis.com/drive/v2/files/'+module.fileId+'?alt=media');
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.onload = function() {
                    resolve(xhr.responseText);
                };
                xhr.send();
            });
        });
    };

    /**
     * TODO: document
     */
    module.save = function(content) {
        return new Promise(function(resolve, reject) {
            var accessToken = gapi.auth.getToken().access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', 'https://www.googleapis.com/upload/drive/v2/files/'+module.fileId+'?uploadType=media&newRevision=true&pinned=true');
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.onload = function() {
                resolve();
            };
            xhr.onerror = function() {
                reject();
            };
            xhr.send(content);
        });
    };

    return module;
}]);
