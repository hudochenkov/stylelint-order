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

	let propData = {
		name: prop,
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
	let isCorrectOrder = previousPropData.name.toLowerCase() <= propData.name.toLowerCase();

	if (isCorrectOrder) {
		return null;
	}

	return {
		expectedFirst: propData.name,
		expectedSecond: previousPropData.name,
	};
}
