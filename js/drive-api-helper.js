var CLIENT_ID = '330949250781-torme3rlgtome44ep48v3qc7ch0lv5sd.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

/**
 * Called when the client library is loaded to start the auth flow.
 */
function handleClientLoad() {
	window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
	gapi.auth.authorize(
		{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
		handleAuthResult);
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
	var authButton = document.getElementById('authorizeButton');
	var content = document.getElementById('content');
	authButton.style.display = 'none';
	content.style.display = 'none';
	if (authResult && !authResult.error) {
		// Access token has been successfully retrieved, requests can be sent to the API.
		content.style.display = 'block';
	} else {
		// No access token could be retrieved, show the button to start the authorization flow.
		authButton.style.display = 'block';
		authButton.onclick = function() {
				gapi.auth.authorize(
						{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
						handleAuthResult);
		};
	}
}

/**
 * Start the file upload.
 *
 * @param {Object} evt Arguments from the file selector.
 */
function uploadFile(data) {
		gapi.client.load('drive', 'v2', function() {
				insertFile(data);
		});
}

/**
 * Verify if has pass.data file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function hasPassdataFile(callback) {
	searchPassdataFile(function(data) {
			callback(data.items.length > 0);
	});
}


/**
 * Download pass.data file.
 *
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadPassdataFile(callback) {
	searchPassdataFile(function(files) {
		if (files.items.length == 0)
			callback();

		var fileId = files.items[0].id;

		loadFile(fileId, function(fileSpecs) {
			//url = fileSpecs.webContentLink;
			url = fileSpecs.downloadUrl;
			downloadFile(url, callback);
		});
	});
}

/**
 * Search pass.data file.
 *
 * @param {Function} callback Function to call when the request is complete.
 */
function searchPassdataFile(callback) {
	searchFile("title contains 'pass.data'", callback);
}

/**
 * Search file.
 *
 * @param {String} q query to find
 * @param {Function} callback Function to call when the request is complete.
 */
function searchFile(q, callback) {
	request = gapi.client.request({
		'path': '/drive/v2/files',
		'method': 'GET',
		'params': {'q': q}
	});

	request.execute(callback);
}

/**
 * Load a specific file.
 *
 * @param {String} fileId
 * @param {Function} callback Function to call when the request is complete.
 */
function loadFile(fileId, callback) {
	request = gapi.client.request({
		'path': '/drive/v2/files/' + fileId,
		'method': 'GET'});

	request.execute(callback);
}


/**
 * Download a specific file.
 *
 * @param {String} fileId
 * @param {Function} callback Function to call when the request is complete.
 */
/*function downloadFile(url, callback) {
		request = gapi.client.request({
				'path': webContentLink,
				'method': 'url'});

		request.execute(callback);
}*/

/**
 * Download a file's content.
 *
 * @param {String} url
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(downloadUrl, callback) {
	if (downloadUrl) {
		var accessToken = gapi.auth.getToken().access_token;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', downloadUrl);
		xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		xhr.onload = function() {
			callback(xhr.responseText);
		};
		xhr.onerror = function() {
			callback(null);
		};
		xhr.send();
	} else {
		callback(null);
	}
}

/**
* Insert new file.
*
* @param {File} fileData File object to read data from.
* @param {Function} callback Function to call when the request is complete.
*/
function insertFile(data, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";

	var contentType = 'application/octet-stream';
	var metadata = {
		'title': 'pass.data',
		'mimeType': contentType
	};

	var base64Data = btoa(data);
	var multipartRequestBody =
		delimiter +
		'Content-Type: application/json\r\n\r\n' +
		JSON.stringify(metadata) +
		delimiter +
		'Content-Type: ' + contentType + '\r\n' +
		'Content-Transfer-Encoding: base64\r\n' +
		'\r\n' +
		base64Data +
		close_delim;

	var request = gapi.client.request({
		'path': '/upload/drive/v2/files',
		'method': 'POST',
		'params': {'uploadType': 'multipart'},
		'headers': {
			'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		},
		'body': multipartRequestBody});

	if (!callback) {
		callback = function(file) {
			console.log(file)
		};
	}
	request.execute(callback);
}
