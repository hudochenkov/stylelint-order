const stylelint = require('stylelint');
const _ = require('lodash');
const postcss = require('postcss');
const postcssSorting = require('postcss-sorting');
const checkAlphabeticalOrder = require('../checkAlphabeticalOrder');
const utils = require('../../utils');

const ruleName = utils.namespace('properties-alphabetical-order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function rule(actual, options = {}, context = {}) {
	return function(root, result) {
		let validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual,
				possible: Boolean,
			},
			{
				actual: options,
				possible: {
					disableFix: Boolean,
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		let disableFix = options.disableFix || false;

		if (context.fix && !disableFix) {
			postcssSorting({ 'properties-order': 'alphabetical' })(root);

			return;
		}

		let processedParents = [];

		root.walk(function processRulesAndAtrules(input) {
			let node = utils.getContainingNode(input);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `utils.getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (utils.isRuleWithNodes(node)) {
				checkNode(node, result);
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;

module.exports = rule;

function checkNode(node, result) {
	let allPropData = [];

	node.each(function processEveryNode(child) {
		if (child.type !== 'decl') {
			return;
		}

		let { prop } = child;

		if (!utils.isStandardSyntaxProperty(prop)) {
			return;
		}

		if (utils.isCustomProperty(prop)) {
			return;
		}

		let unprefixedPropName = postcss.vendor.unprefixed(prop);

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

		let previousPropData = _.last(allPropData);

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
