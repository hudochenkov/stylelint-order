/**
 * Checks if the value is a boolean or a Boolean object.
 * @param {any} value
 * @returns {boolean}
 */
export function isBoolean(value) {
	return typeof value === 'boolean';
}

/**
 * Checks if the value is a number or a Number object.
 * @param {any} value
 * @returns {boolean}
 */
export function isNumber(value) {
	return typeof value === 'number';
}

/**
 * Checks if the value is a RegExp object.
 * @param {any} value
 * @returns {boolean}
 */
export function isRegExp(value) {
	return value instanceof RegExp;
}

/**
 * Checks if the value is a string or a String object.
 * @param {any} value
 * @returns {boolean}
 */
export function isString(value) {
	return typeof value === 'string';
}

/**
 * Checks if the value is an object.
 * @param {any} value
 * @returns {boolean}
 */
export function isObject(value) {
	return typeof value === 'object' && value !== null;
}
