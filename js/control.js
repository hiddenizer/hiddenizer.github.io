"use strict";

// random numbers generator
var prng = sjcl.random;

// characters for a randomly generated password
var pwdSafeLetters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var pwdUnsafeLetters = " !#$%&)*+,-./:;<=>?@]^_`|}";
var pwdAllLetters = pwdSafeLetters + pwdUnsafeLetters;

// start adding entropy to PRNG
window.onload = function() {
	prng.startCollectors();
}

function generate(safeOnly) {
	safeOnly = safeOnly || false;
	try {
		var randomField = document.getElementById('randomField');
		var nums = prng.randomWords(15);
		var letters = (safeOnly ? pwdSafeLetters : pwdAllLetters);
		var chars = '';
		for (var i = 0; i < nums.length; i++) {
			var pos = Math.abs(nums[i] % letters.length);
			chars += letters.charAt(pos);
		}
		randomField.value = chars;
	} catch(err) {
		alert(err);
	}
}

// validate, consume and clear password fields
function readPassword() {

	// get fields and read values
	var passwordField = document.getElementById('passwordField');
	var password = passwordField.value;

	// clear fields
	passwordField.value = '';

	// assert not blank
	if (password === '') {
		throw 'Password cannot be blank!';
	}

	return password;
}

// encrypt the content
function encrypt() {
	try {
		var contentField = document.getElementById('contentField');
		var password = readPassword();
		var encrypted = sjcl.encrypt(password, contentField.value);
		contentField.value = encrypted;
	} catch(err) {
		alert(err);
	}
}

// decrypt the content
function decrypt() {
	try {
	var contentField = document.getElementById('contentField');
	var password = readPassword();
	var decrypted = sjcl.decrypt(password, contentField.value);
	contentField.value = decrypted;
	} catch(err) {
		alert(err);
	}
}
