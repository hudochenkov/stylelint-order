'use strict';

const stylelint = require('stylelint');
const _ = require('lodash');
const utils = require('../../utils');
const declarationBlockPropertiesSpecifiedOrder = require('../declaration-block-properties-specified-order');

const ruleName = utils.namespace('declaration-block-properties-flexible-order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function createExpectedOrder(input) {
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

		if (!item.order || item.order === 'strict') {
			appendGroup(item.properties);
		} else if (item.order === 'flexible') {
			expectedPosition += 1;
			item.properties.forEach((property) => {
				appendItem(property, true);
			});
		}
	}

	return order;
}

function validatePrimaryOption(actualOptions) {
	// Otherwise, begin checking array options
	if (!Array.isArray(actualOptions)) {
		return false;
	}

	const objectItems = actualOptions.filter(_.isPlainObject);

	// Every object-item's "order" property must be "strict" or "flexible"
	if (!objectItems.every((item) => {
		if (_.isUndefined(item.order)) {
			return true;
		}

		return _.includes([
			'strict',
			'flexible',
		], item.order);
	})) {
		return false;
	}

	return true;
}

module.exports = declarationBlockPropertiesSpecifiedOrder;
module.exports.ruleName = ruleName;
module.exports.messages = messages;

module.exports.createExpectedOrder = createExpectedOrder;
module.exports.validatePrimaryOption = validatePrimaryOption;
