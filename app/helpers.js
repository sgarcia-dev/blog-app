// Documented using JSDoc
// https://en.wikipedia.org/wiki/JSDoc

module.exports = {
	filterObject,
	checkObjectProperties
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