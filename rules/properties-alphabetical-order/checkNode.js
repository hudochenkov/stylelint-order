import stylelint from 'stylelint';
import { checkAlphabeticalOrder } from '../checkAlphabeticalOrder.js';
import { isCustomProperty } from '../../utils/isCustomProperty.js';
import { isStandardSyntaxProperty } from '../../utils/isStandardSyntaxProperty.js';
import * as vendor from '../../utils/vendor.js';
import sortNodeProperties from 'postcss-sorting/lib/properties-order/sortNodeProperties.js';

// eslint-disable-next-line max-params
export function checkNode(node, result, ruleName, messages, isFixEnabled) {
	let allPropData = [];

	if (isFixEnabled) {
		sortNodeProperties(node, { order: 'alphabetical' });
	}

	node.each(function processEveryNode(child) {
		if (child.type !== 'decl') {
			return;
		}

		let { prop } = child;

		if (!isStandardSyntaxProperty(prop)) {
			return;
		}

		if (isCustomProperty(prop)) {
			return;
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

		let previousPropData = allPropData[allPropData.length - 1]; // eslint-disable-line unicorn/prefer-at -- Need to support older Node.js

		allPropData.push(propData);

		// Skip first decl
		if (!previousPropData) {
			return;
		}

		let isCorrectOrder = checkAlphabeticalOrder(previousPropData, propData);

		if (isCorrectOrder) {
			return;
		}

		stylelint.utils.report({
			message: messages.expected(propData.name, previousPropData.name),
			node: child,
			result,
			ruleName,
		});
	});
}
