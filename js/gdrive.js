(function(global) {
	var module = {};

	var CLIENT_ID = '330949250781-torme3rlgtome44ep48v3qc7ch0lv5sd.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/drive.file'];

	module.load = function() {
		gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true})
		.then(function() {
				return gapi.client.load('drive', 'v2');
		});
	}

	global.gdrive = module;
})(this);
