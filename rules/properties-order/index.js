'use strict';

const stylelint = require('stylelint');
const _ = require('lodash');
const utils = require('../../utils');
const checkNode = require('./checkNode');
const createExpectedOrder = require('./createExpectedOrder');
const validatePrimaryOption = require('./validatePrimaryOption');

const ruleName = utils.namespace('properties-order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected "${first}" to come before "${second}"`,
	expectedEmptyLineBefore: (property) => `Expected an empty line before property "${property}"`,
	rejectedEmptyLineBefore: (property) => `Unexpected an empty line before property "${property}"`,
});

const rule = function (expectation, options) {
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
					unspecified: [
						'top',
						'bottom',
						'ignore',
						'bottomAlphabetical',
					],
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
			expectation,
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
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
