'use strict';

function getOrderData(expectedOrder, propName) {
	let orderData = expectedOrder[propName];

	// If prop was not specified but has a hyphen
	// (e.g. `padding-top`), try looking for the segment preceding the hyphen
	// and use that index
	if (!orderData && propName.lastIndexOf('-') !== -1) {
		const propNamePreHyphen = propName.slice(0, propName.lastIndexOf('-'));

		orderData = getOrderData(expectedOrder, propNamePreHyphen);
	}

	return orderData;
}

module.exports = getOrderData;
