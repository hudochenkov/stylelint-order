'use strict';

const stylelint = require('stylelint');
const _ = require('lodash');
const postcss = require('postcss');
const utils = require('../../utils');
const getOrderData = require('../getOrderData');
const createExpectedOrder = require('../createExpectedOrder');

const ruleName = utils.namespace('declaration-block-properties-specified-order');

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
					unspecified: ['top', 'bottom', 'ignore', 'bottomAlphabetical'],
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
					orderData: getOrderData(expectedOrder, unprefixedPropName),
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

				const isCorrectOrder = checkOrder(previousPropData, propData);

				if (isCorrectOrder) {
					return;
				}

				complain({
					message: messages.expected(propData.name, previousPropData.name),
					node: child,
				});
			});

			function checkOrder(firstPropData, secondPropData) {
				// If unprefixed prop names are the same, compare the prefixed versions
				if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
					// If first property has no prefix and second property has prefix
					if (!postcss.vendor.prefix(firstPropData.name).length && postcss.vendor.prefix(secondPropData.name).length) {
						return false;
					}

					return true;
				}

				const firstPropIsUnspecified = !firstPropData.orderData;
				const secondPropIsUnspecified = !secondPropData.orderData;

				// Now check actual known properties ...
				if (!firstPropIsUnspecified && !secondPropIsUnspecified) {
					return firstPropData.orderData.expectedPosition <= secondPropData.orderData.expectedPosition;
				}

				if (firstPropIsUnspecified && !secondPropIsUnspecified) {
					// If first prop is unspecified, look for a specified prop before it to
					// compare to the current prop
					const priorSpecifiedPropData = _.findLast(allPropData.slice(0, -1), (d) => Boolean(d.orderData));

					if (
						priorSpecifiedPropData && priorSpecifiedPropData.orderData &&
						priorSpecifiedPropData.orderData.expectedPosition > secondPropData.orderData.expectedPosition
					) {
						complain({
							message: messages.expected(secondPropData.name, priorSpecifiedPropData.name),
							node: secondPropData.node,
						});

						return true; // avoid logging another warning
					}
				}

				// Now deal with unspecified props ...
				// Starting with bottomAlphabetical as it requires more specific conditionals
				if (
					unspecified === 'bottomAlphabetical' &&
					!firstPropIsUnspecified &&
					secondPropIsUnspecified
				) {
					return true;
				}

				if (
					unspecified === 'bottomAlphabetical' &&
					secondPropIsUnspecified &&
					firstPropIsUnspecified
				) {
					if (utils.checkAlpabeticalOrder(firstPropData, secondPropData)) {
						return true;
					}

					return false;
				}
				if (unspecified === 'bottomAlphabetical' && firstPropIsUnspecified) {
					return false;
				}

				if (firstPropIsUnspecified && secondPropIsUnspecified) {
					return true;
				}

				if (unspecified === 'ignore' && (firstPropIsUnspecified || secondPropIsUnspecified)) {
					return true;
				}

				if (unspecified === 'top' && firstPropIsUnspecified) {
					return true;
				}
				if (unspecified === 'top' && secondPropIsUnspecified) {
					return false;
				}

				if (unspecified === 'bottom' && secondPropIsUnspecified) {
					return true;
				}
				if (unspecified === 'bottom' && firstPropIsUnspecified) {
					return false;
				}
			}
		}

		function complain(input) {
			const message = input.message;
			const node = input.node;

			stylelint.utils.report({
				message,
				node,
				result,
				ruleName,
			});
		}
	};
}

function validatePrimaryOption(actualOptions) {
	// Otherwise, begin checking array options
	if (!Array.isArray(actualOptions)) {
		return false;
	}

	// Every item in the array must be a string
	if (!actualOptions.every((item) => _.isString(item))) {
		return false;
	}

	return true;
}

rule.primaryOptionArray = true;

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
