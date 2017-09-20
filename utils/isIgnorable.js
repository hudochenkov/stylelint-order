/**
 * Check whether a property should be ignored when checking alphabetical order.
 *
 * @param {string} property
 * @return {boolean} If `true`, property should be ignored
 */
const regex = /^-styled/;

module.exports = function isIgnorable(property) {
	return regex.test(property);
};
