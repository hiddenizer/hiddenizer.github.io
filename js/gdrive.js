(function(global) {
    var module = {};

    var CLIENT_ID = '780199501376-q7dm26lauueljp43upe0jdt6jje5s255.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/drive'];

    module.load = function() {
        return gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES})
        .then(function() {
            return gapi.client.load('drive', 'v2');
        }).then(function() {
            var request = gapi.client.drive.files.list({
                q: "title = 'passwords.shadow'",
                fields: 'items(id,title)',
                immediate: true,
            });
            return new Promise(function(resolve, reject) {
                request.execute(resolve);
            });
        }).then(function(resp) {
            return new Promise(function(resolve, reject) {
                var accessToken = gapi.auth.getToken().access_token;
                var fileId = resp.items[0].id;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://www.googleapis.com/drive/v2/files/'+fileId+'?alt=media');
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.onload = function() {
                    resolve(xhr.responseText);
                };
                xhr.send();
            });
        });
    };

    global.gdrive = module;
})(this);
