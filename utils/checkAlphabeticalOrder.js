import { isShorthand } from './isShorthand.js';
import * as vendor from './vendor.js';

export function checkAlphabeticalOrder(firstPropData, secondPropData) {
	let firstPropName = firstPropData.name.toLowerCase();
	let secondPropName = secondPropData.name.toLowerCase();
	let firstPropUnprefixedName = firstPropData.unprefixedName.toLowerCase();
	let secondPropUnprefixedName = secondPropData.unprefixedName.toLowerCase();

	// OK if the first is shorthand for the second:
	if (isShorthand(firstPropUnprefixedName, secondPropUnprefixedName)) {
		return true;
	}

	// Not OK if the second is shorthand for the first:
	if (isShorthand(secondPropUnprefixedName, firstPropUnprefixedName)) {
		return false;
	}

	// If unprefixed prop names are the same, compare the prefixed versions
	if (firstPropUnprefixedName === secondPropUnprefixedName) {
		// If first property has no prefix and second property has prefix
		if (!vendor.prefix(firstPropName).length && vendor.prefix(secondPropName).length) {
			return false;
		}

		return true;
	}

	return firstPropUnprefixedName < secondPropUnprefixedName;
}
