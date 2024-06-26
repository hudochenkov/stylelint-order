/**
 * Check whether a property is a $-variable
 *
 * @param {string} property
 * @return {boolean} If `true`, property is a $-variable
 */

export function isDollarVariable(property) {
	return property.startsWith('$');
}
