const stylelint = require('stylelint');
const _ = require('lodash');
const postcssSorting = require('postcss-sorting');
const utils = require('../../utils');
const checkNode = require('./checkNode');
const createExpectedOrder = require('./createExpectedOrder');
const validatePrimaryOption = require('./validatePrimaryOption');

const ruleName = utils.namespace('order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function rule(expectation, options = {}, context = {}) {
	return function(root, result) {
		let validOptions = stylelint.utils.validateOptions(
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
					disableFix: _.isBoolean,
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		let disableFix = options.disableFix || false;
		let isFixEnabled = context.fix && !disableFix;

		let expectedOrder = createExpectedOrder(expectation);

		// By default, ignore unspecified properties
		let unspecified = options.unspecified || 'ignore';

		let sharedInfo = {
			expectedOrder,
			unspecified,
			messages,
			ruleName,
			result,
			isFixEnabled,
			shouldFix: false,
		};

		let processedParents = [];

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(input) {
			// return early if we know there is a violation and auto fix should be applied
			if (isFixEnabled && sharedInfo.shouldFix) {
				return;
			}

			let node = utils.getContainingNode(input);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `utils.getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (utils.isRuleWithNodes(node)) {
				checkNode(node, sharedInfo);
			}
		});

		if (sharedInfo.shouldFix) {
			postcssSorting({ order: expectation })(root);
		}
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.primaryOptionArray = true;

module.exports = rule;
