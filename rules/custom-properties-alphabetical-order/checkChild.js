import { isStandardSyntaxProperty } from '../../utils/isStandardSyntaxProperty.js';
import { isCustomProperty } from '../../utils/isCustomProperty.js';

export function checkChild(child, allPropData) {
	if (child.type !== 'decl') {
		return null;
	}

	let { prop } = child;

	if (!isStandardSyntaxProperty(prop)) {
		return null;
	}

	// Only process custom properties (--*)
	if (!isCustomProperty(prop)) {
		return null;
	}

	// Custom properties don't have vendor prefixes, so we use the prop name as-is
	let propData = {
		name: prop,
		unprefixedName: prop.toLowerCase(),
		index: allPropData.length,
		node: child,
	};

	let previousPropData = allPropData.at(-1);

	allPropData.push(propData);

	// Skip first decl
	if (!previousPropData) {
		return null;
	}

	// Simple alphabetical comparison for custom properties
	// No shorthand or vendor prefix logic needed
	let isCorrectOrder = previousPropData.unprefixedName <= propData.unprefixedName;

	if (isCorrectOrder) {
		return null;
	}

	return {
		expectedFirst: propData.name,
		expectedSecond: previousPropData.name,
	};
}
