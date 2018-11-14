const stylelint = require('stylelint');
const _ = require('lodash');
const utils = require('../../utils');
const checkNode = require('./checkNode');
const createExpectedOrder = require('./createExpectedOrder');
const validatePrimaryOption = require('./validatePrimaryOption');

const ruleName = utils.namespace('properties-order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second, groupName) => `
	  Expected "${first}" to come before "${second}"${groupName ? ` in group "${groupName}"` : ''}`,
	expectedEmptyLineBefore: property => `Expected an empty line before property "${property}"`,
	rejectedEmptyLineBefore: property => `Unexpected an empty line before property "${property}"`,
});

const rule = function(expectation, options, context = {}) {
	return function(root, result) {
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
					unspecified: ['top', 'bottom', 'ignore', 'bottomAlphabetical'],
					disableFix: _.isBoolean,
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		// By default, ignore unspecified properties
		const unspecified = _.get(options, 'unspecified', 'ignore');
		const disableFix = _.get(options, 'disableFix', false);
		const isFixEnabled = context.fix && !disableFix;

		const expectedOrder = createExpectedOrder(expectation);

		const sharedInfo = {
			expectedOrder,
			expectation,
			unspecified,
			messages,
			ruleName,
			result,
			context,
			isFixEnabled,
		};

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(node) {
			if (utils.isRuleWithNodes(node)) {
				checkNode(node, sharedInfo);
			}
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
