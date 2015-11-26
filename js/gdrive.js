(function(global) {
	var module = {};

	var CLIENT_ID = '780199501376-q7dm26lauueljp43upe0jdt6jje5s255.apps.googleusercontent.com';
	var SCOPES = ['https://www.googleapis.com/auth/drive'];

	module.load = function() {
		return gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, 'immediate': true})
		.then(function() {
			return gapi.client.load('drive', 'v2');
		}).then(function() {
	        var request = gapi.client.drive.files.list({
	            'q': "title contains 'senha'",
				'fields': 'items(id,title)'
	        });
			return new Promise(function(resolve, reject) {
				request.execute(resolve);
			});
		});
	};

	global.gdrive = module;
})(this);
