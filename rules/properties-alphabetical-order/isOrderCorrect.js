import { isStandardSyntaxProperty } from '../../utils/isStandardSyntaxProperty.js';
import { isCustomProperty } from '../../utils/isCustomProperty.js';
import * as vendor from '../../utils/vendor.js';
import { checkAlphabeticalOrder } from '../checkAlphabeticalOrder.js';

export function isOrderCorrect(node) {
	const allPropData = [];

	return node.every(function isNodeCorrect(child) {
		if (child.type !== 'decl') {
			return true;
		}

		const { prop } = child;

		if (!isStandardSyntaxProperty(prop)) {
			return true;
		}

		if (isCustomProperty(prop)) {
			return true;
		}

		let unprefixedPropName = vendor.unprefixed(prop);

		// Hack to allow -moz-osx-font-smoothing to be understood
		// just like -webkit-font-smoothing
		if (unprefixedPropName.startsWith('osx-')) {
			unprefixedPropName = unprefixedPropName.slice(4);
		}

		const propData = {
			name: prop,
			unprefixedName: unprefixedPropName,
			index: allPropData.length,
			node: child,
		};

		const previousPropData = allPropData[allPropData.length - 1]; // eslint-disable-line unicorn/prefer-at -- Need to support older Node.js

		allPropData.push(propData);

		// Skip first decl
		if (!previousPropData) {
			return true;
		}

		return checkAlphabeticalOrder(previousPropData, propData);
	});
}
