// Documented using JSDoc
// https://en.wikipedia.org/wiki/JSDoc

module.exports = {
	filterObject,
	checkObjectProperties,
	newUsernameValid,
	newPasswordValid
};

/**
 * Returns a new object built from properties found on objectToFIlter
 * @param {String[]} propertiesToFilter | An Array of string properties to check
 * @param {Object} objectToFilter | An object that will be filtered
 * @returns {Object} filteredObject | An object with properties matched from the
 * propertiesToFilter array and objectToFilter object.
 */
function filterObject(propertiesToFilter, objectToFilter) {
	const filteredObject = {};
    
	propertiesToFilter.forEach(propertyName => {
		if (propertyName in objectToFilter) {
			filteredObject[propertyName] = objectToFilter[propertyName];
		}
	});
    
	return filteredObject;
}

/**
 * Checks an object for properties listed in a propertiesToCheck array, and returns
 * an array of string properties not found in the objectToCheck parameter.
 * @param {String[]} propertiesToCheck | A string array of properties to be checked
 * @param {Object} objectToCheck | An object to be checked for properties
 * @returns {String[]} propertiesNotFound | A string array of properties not found
 * in objectToCheck.
 */
function checkObjectProperties(propertiesToCheck, objectToCheck) {
	const propertiesNotFound = [];
	propertiesToCheck.forEach(propertyName => {
		if (!objectToCheck.hasOwnProperty(propertyName)) {
			propertiesNotFound.push(propertyName);
		}
	});
	return propertiesNotFound;
}

function newUsernameValid(username) {
	const MIN = 5;
	const MAX = 25;
	const validation = {
		isValid: true,
		reason: ''
	};

	if (username.trim() !== username) {
		validation.isValid = false;
		validation.reason = 'ValidationError: Username must have no trailing spaces';
	} else if (!(username.length >= MIN && username.length <= MAX)) {
		validation.isValid = false;
		validation.reason = `ValidationError: Username must be between ${MIN} and ${MAX} characters long.`;
	}
	return validation;
}

function newPasswordValid(password) {
	const MIN = 8;
	const MAX = 30;
	const validation = {
		isValid: true,
		reason: ''
	};

	if (password.trim() !== password) {
		validation.isValid = false;
		validation.reason = 'ValidationError: Username must have no trailing spaces';
	} else if (!(password.length >= MIN && password.length <= MAX)) {
		validation.isValid = false;
		validation.reason = `ValidationError: Username must be between ${MIN} and ${MAX} characters long.`;
	}
	return validation;
}