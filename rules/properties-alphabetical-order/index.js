'use strict';

const stylelint = require('stylelint');
const _ = require('lodash');
const postcss = require('postcss');
const checkAlphabeticalOrder = require('../checkAlphabeticalOrder');
const utils = require('../../utils');

const ruleName = utils.namespace('properties-alphabetical-order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function rule(actual) {
	return function (root, result) {
		utils.renamedRuleWarning('declaration-block-properties-alphabetical-order', ruleName, result);

		const validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual,
			}
		);

		if (!validOptions) {
			return;
		}

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(node) {
			if (node.type === 'rule' || node.type === 'atrule') {
				checkNode(node);
			}
		});

		function checkNode(node) {
			// Skip if it's an empty rule
			if (!node.nodes || !node.nodes.length) {
				return;
			}

			const allPropData = [];

			node.each(function processEveryNode(child) {
				if (child.type !== 'decl') {
					return;
				}

				const prop = child.prop;

				if (!utils.isStandardSyntaxProperty(prop)) {
					return;
				}

				if (utils.isCustomProperty(prop)) {
					return;
				}

				let unprefixedPropName = postcss.vendor.unprefixed(prop);

				// Hack to allow -moz-osx-font-smoothing to be understood
				// just like -webkit-font-smoothing
				if (unprefixedPropName.indexOf('osx-') === 0) {
					unprefixedPropName = unprefixedPropName.slice(4);
				}

				const propData = {
					name: prop,
					unprefixedName: unprefixedPropName,
					before: child.raw('before'),
					index: allPropData.length,
					node: child,
				};

				const previousPropData = _.last(allPropData);

				allPropData.push(propData);

				// Skip first decl
				if (!previousPropData) {
					return;
				}

				const isCorrectOrder = checkAlphabeticalOrder(previousPropData, propData);

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
	};
}

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
