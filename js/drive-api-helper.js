var CLIENT_ID = '330949250781-torme3rlgtome44ep48v3qc7ch0lv5sd.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

var AUTHORIZED;

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
  AUTHORIZED = false;
  if (authResult && !authResult.error) {
    // Access token has been successfully retrieved, requests can be sent to the API.
    AUTHORIZED = true;
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
 * Start the file downloads.
 *
 * @param {Object} evt Arguments from the file selector.
 */
function getFile() {
  gapi.client.load('drive', 'v2', function() {
      loadFile();
  });
}

/**
 * Get file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function loadFile(callback) {
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
        'method': 'GET',
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
