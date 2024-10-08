import { shorthandData } from './shorthandData.js';
import * as vendor from '../utils/vendor.js';

function isShorthand(a, b) {
	const longhands = shorthandData[a] || [];

	return longhands.includes(b);
}

function hasPrefix(propName) {
	return vendor.prefix(propName).length > 0;
}

export function checkAlphabeticalOrder(firstPropData, secondPropData) {
	const firstUnprefixedNameLC = firstPropData.unprefixedName.toLowerCase();
	const secondUnprefixedNameLC = secondPropData.unprefixedName.toLowerCase();

	// OK if the first is shorthand for the second:
	if (isShorthand(firstUnprefixedNameLC, secondUnprefixedNameLC)) {
		return true;
	}

	// Not OK if the second is shorthand for the first:
	if (isShorthand(firstUnprefixedNameLC, secondUnprefixedNameLC)) {
		return false;
	}

	// If unprefixed prop names are the same, compare the prefixed versions
	if (firstUnprefixedNameLC === secondUnprefixedNameLC) {
		if (!hasPrefix(firstPropData.name) && hasPrefix(secondPropData.name)) {
			return false;
		}

		return true;
	}

	return firstUnprefixedNameLC < secondUnprefixedNameLC;
}
