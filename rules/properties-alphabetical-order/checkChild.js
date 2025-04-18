import { isStandardSyntaxProperty } from '../../utils/isStandardSyntaxProperty.js';
import { isCustomProperty } from '../../utils/isCustomProperty.js';
import * as vendor from '../../utils/vendor.js';
import { checkAlphabeticalOrder } from '../../utils/checkAlphabeticalOrder.js';

export function checkChild(child, allPropData) {
	if (child.type !== 'decl') {
		return null;
	}

	let { prop } = child;

	if (!isStandardSyntaxProperty(prop)) {
		return null;
	}

	if (isCustomProperty(prop)) {
		return null;
	}

	let unprefixedPropName = vendor.unprefixed(prop);

	// Hack to allow -moz-osx-font-smoothing to be understood
	// just like -webkit-font-smoothing
	if (unprefixedPropName.startsWith('osx-')) {
		unprefixedPropName = unprefixedPropName.slice(4);
	}

	let propData = {
		name: prop,
		unprefixedName: unprefixedPropName,
		index: allPropData.length,
		node: child,
	};

	let previousPropData = allPropData.at(-1);

	allPropData.push(propData);

	// Skip first decl
	if (!previousPropData) {
		return null;
	}

	let isCorrectOrder = checkAlphabeticalOrder(previousPropData, propData);

	if (isCorrectOrder) {
		return null;
	}

	return {
		expectedFirst: propData.name,
		expectedSecond: previousPropData.name,
	};
}
