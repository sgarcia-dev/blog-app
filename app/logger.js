// https://www.npmjs.com/package/colors
const colors = require('colors/safe');

module.exports = {
	logInfo,
	logWarn,
	logSuccess,
	logError
};

function logInfo(message) {
	console.log(colors.blue(`${timestamp()} [INFO] ${message}`));
}

function logWarn(message) {
	console.log(colors.yellow(`${timestamp()} [WARN] ${message}`));
}

function logSuccess(message) {
	console.log(colors.green(`${timestamp()} [SUCCESS] ${message}`));
}

function logError(message) {
	console.log(colors.red(`${timestamp()} [ERROR] ${message}`));
}

function timestamp() {
	const now = new Date();
	const hour = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	const milliseconds = now.getMilliseconds();
	return `[${hour}:${minutes}:${seconds}:${milliseconds}]`;
}