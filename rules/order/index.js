'use strict';

const stylelint = require('stylelint');
const _ = require('lodash');
const utils = require('../../utils');
const checkNode = require('./checkNode');
const createExpectedOrder = require('./createExpectedOrder');
const validatePrimaryOption = require('./validatePrimaryOption');

const ruleName = utils.namespace('order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function rule(expectation, options) {
	return function (root, result) {
		const validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual: expectation,
				possible: validatePrimaryOption,
			},
			{
				actual: options,
				possible: {
					unspecified: ['top', 'bottom', 'ignore'],
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		const expectedOrder = createExpectedOrder(expectation);

		// By default, ignore unspecified properties
		const unspecified = _.get(options, ['unspecified'], 'ignore');

		const sharedInfo = {
			expectedOrder,
			unspecified,
			messages,
			ruleName,
			result,
		};

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(node) {
			if (node.type === 'rule' || node.type === 'atrule') {
				checkNode(node, sharedInfo);
			}
		});
	};
}

rule.primaryOptionArray = true;

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
