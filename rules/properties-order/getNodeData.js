import { isProperty } from '../../utils/isProperty.js';
import * as vendor from '../../utils/vendor.js';

export function getNodeData(node, expectedOrder) {
	if (isProperty(node)) {
		let { prop } = node;
		let unprefixedName = vendor.unprefixed(prop).toLowerCase();

		// Hack to allow -moz-osx-font-smoothing to be understood
		// just like -webkit-font-smoothing
		if (unprefixedName.startsWith('osx-')) {
			unprefixedName = unprefixedName.slice(4);
		}

		return {
			node,
			name: prop,
			unprefixedName,
			orderData: expectedOrder[unprefixedName],
		};
	}

	return {
		node,
	};
}
