'use strict';

const _ = require('lodash');

module.exports = function (input) {
	const order = {};
	let expectedPosition = 0;

	input.forEach((item) => {
		expectedPosition += 1;

		order[item] = {
			expectedPosition,
		};
	});

	appendGroup(input);

	function appendGroup(items) {
		items.forEach((item) => appendItem(item, false));
	}

	function appendItem(item, inFlexibleGroup) {
		if (_.isString(item)) {
			// In flexible groups, the expectedPosition does not ascend
			// to make that flexibility work;
			// otherwise, it will always ascend
			if (!inFlexibleGroup) {
				expectedPosition += 1;
			}

			order[item] = { expectedPosition };

			return;
		}

		expectedPosition += 1;
		item.properties.forEach((property) => {
			appendItem(property, true);
		});
	}

	return order;
};
