'use strict';

const stylelint = require('stylelint');
const _ = require('lodash');
const postcss = require('postcss');
const checkAlphabeticalOrder = require('../checkAlphabeticalOrder');
const utils = require('../../utils');

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
			const allNodesData = [];
			let lastKnownSeparatedGroup = 1;

			node.each(function processEveryNode(child) {
				let nodeData = {
					node: child,
				};

				if (
					child.type === 'decl'
					|| utils.isScssNestedPropertiesRoot(child)
				) {
					let prop = child.prop;

					if (utils.isScssNestedPropertiesRoot(child)) {
						prop = child.selector.slice(0, -1);
					}

					if (
						utils.isStandardSyntaxProperty(prop)
						&& !utils.isCustomProperty(prop)
					) {
						let unprefixedPropName = postcss.vendor.unprefixed(prop);

						// Hack to allow -moz-osx-font-smoothing to be understood
						// just like -webkit-font-smoothing
						if (unprefixedPropName.indexOf('osx-') === 0) {
							unprefixedPropName = unprefixedPropName.slice(4);
						}

						nodeData = {
							name: prop,
							unprefixedName: unprefixedPropName,
							orderData: getOrderData(expectedOrder, unprefixedPropName),
							node: child,
						};

						allPropData.push(nodeData);
					}
				}

				allNodesData.push(nodeData);

				if (
					child.type !== 'decl'
					&& !utils.isScssNestedPropertiesRoot(child)
				) {
					return;
				}

				// current node should have standard property name
				const propertyName = utils.isScssNestedPropertiesRoot(child) ? nodeData.name : nodeData.node.prop;

				if (
					!propertyName
					|| !utils.isStandardSyntaxProperty(propertyName)
					|| utils.isCustomProperty(propertyName)
				) {
					return;
				}

				// First, check order
				const previousPropData = _.nth(allPropData, -2);

				// Skip first decl
				if (previousPropData) {
					const isCorrectOrder = checkOrder(previousPropData, nodeData);

					if (!isCorrectOrder) {
						complain({
							message: messages.expected(nodeData.name, previousPropData.name),
							node: child,
						});
					}
				}

				// Second, check emptyLineBefore
				let previousNodeData = _.nth(allNodesData, -2);

				// if previous node is shared-line comment, use second previous node
				if (
					previousNodeData
					&& previousNodeData.node.type === 'comment'
					&& previousNodeData.node.raw('before').indexOf('\n') === -1
				) {
					previousNodeData = _.nth(allNodesData, -3);
				}

				// skip first decl
				if (!previousNodeData) {
					return;
				}

				if (previousNodeData.node.type !== 'decl') {
					return;
				}

				// previous node should be a standard declaration
				if (
					!utils.isStandardSyntaxProperty(previousNodeData.node.prop)
					|| utils.isCustomProperty(previousNodeData.node.prop)
				) {
					return;
				}

				checkEmptyLineBefore(previousPropData, nodeData);
			});

			function checkOrder(firstPropData, secondPropData) {
				if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
					// If first property has no prefix and second property has prefix
					if (!postcss.vendor.prefix(firstPropData.name).length && postcss.vendor.prefix(secondPropData.name).length) {
						return false;
					}

					return true;
				}

				const firstPropIsUnspecified = !firstPropData.orderData;
				const secondPropIsUnspecified = !secondPropData.orderData;

				// Check actual known properties
				if (!firstPropIsUnspecified && !secondPropIsUnspecified) {
					return firstPropData.orderData.expectedPosition <= secondPropData.orderData.expectedPosition;
				}

				if (firstPropIsUnspecified && !secondPropIsUnspecified) {
					// If first prop is unspecified, look for a specified prop before it to
					// compare to the current prop
					const priorSpecifiedPropData = _.findLast(allPropData.slice(0, -1), (d) => Boolean(d.orderData));

					if (
						priorSpecifiedPropData
						&& priorSpecifiedPropData.orderData
						&& priorSpecifiedPropData.orderData.expectedPosition > secondPropData.orderData.expectedPosition
					) {
						complain({
							message: messages.expected(secondPropData.name, priorSpecifiedPropData.name),
							node: secondPropData.node,
						});

						return true; // avoid logging another warning
					}
				}

				// Now deal with unspecified props
				// Starting with bottomAlphabetical as it requires more specific conditionals
				if (
					unspecified === 'bottomAlphabetical'
					&& !firstPropIsUnspecified
					&& secondPropIsUnspecified
				) {
					return true;
				}

				if (
					unspecified === 'bottomAlphabetical'
					&& secondPropIsUnspecified
					&& firstPropIsUnspecified
				) {
					if (checkAlphabeticalOrder(firstPropData, secondPropData)) {
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

			function checkEmptyLineBefore(firstPropData, secondPropData) {
				const firstPropIsUnspecified = !firstPropData.orderData;
				const secondPropIsUnspecified = !secondPropData.orderData;

				// Now check newlines between ...
				const firstPropSeparatedGroup = (!firstPropIsUnspecified)
					? firstPropData.orderData.separatedGroup
					: lastKnownSeparatedGroup;
				const secondPropSeparatedGroup = (!secondPropIsUnspecified)
					? secondPropData.orderData.separatedGroup
					: lastKnownSeparatedGroup;

				if (
					firstPropSeparatedGroup !== secondPropSeparatedGroup
					&& !secondPropIsUnspecified
				) {
					// Get an array of just the property groups, remove any solo properties
					const groups = _.reject(expectation, _.isString);

					// secondProp seperatedGroups start at 2 so we minus 2 to get the 1st item
					// from our groups array
					const emptyLineBefore = _.get(groups[secondPropSeparatedGroup - 2], 'emptyLineBefore');

					if (!hasEmptyLineBefore(secondPropData.node) && emptyLineBefore === 'always') {
						complain({
							message: messages.expectedEmptyLineBefore(secondPropData.name),
							node: secondPropData.node,
						});
					} else if (hasEmptyLineBefore(secondPropData.node) && emptyLineBefore === 'never') {
						complain({
							message: messages.rejectedEmptyLineBefore(secondPropData.name),
							node: secondPropData.node,
						});
					}
				}

				lastKnownSeparatedGroup = secondPropSeparatedGroup;
			}
		}

		function complain(input) {
			stylelint.utils.report({
				message: input.message,
				node: input.node,
				result,
				ruleName,
			});
		}
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;

function createExpectedOrder(input) {
	const order = {};
	let expectedPosition = 0;
	let separatedGroup = 1;

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

			order[item] = { separatedGroup, expectedPosition };

			return;
		}

		// If item is not a string, it's a group...
		if (item.emptyLineBefore) {
		  separatedGroup += 1;
		}

		if (item.order && item.order === 'flexible') {
			expectedPosition += 1;

			item.properties.forEach((property) => {
				appendItem(property, true);
			});
		} else {
			appendGroup(item.properties);
		}
	}

	return order;
}

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

function hasEmptyLineBefore(decl) {
	if (/\r?\n\s*\r?\n/.test(decl.raw('before'))) {
		return true;
	}

	const prevNode = decl.prev();

	if (!prevNode) {
		return false;
	}

	if (prevNode.type !== 'comment') {
		return false;
	}

	if (/\r?\n\s*\r?\n/.test(prevNode.raw('before'))) {
		return true;
	}

	return false;
}

function validatePrimaryOption(actualOptions) {
	// Begin checking array options
	if (!Array.isArray(actualOptions)) {
		return false;
	}

	// Every item in the array must be a string or an object
	// with a "properties" property
	if (!actualOptions.every((item) => {
		if (_.isString(item)) {
			return true;
		}

		return _.isPlainObject(item) && !_.isUndefined(item.properties);
	})) {
		return false;
	}

	const objectItems = actualOptions.filter(_.isPlainObject);

	// Every object-item's "properties" should be an array with no items, or with strings
	if (!objectItems.every((item) => {
		if (!Array.isArray(item.properties)) {
			return false;
		}

		return item.properties.every((property) => _.isString(property));
	})) {
		return false;
	}

	// Every object-item's "emptyLineBefore" must be "always" or "never"
	if (!objectItems.every((item) => {
		if (_.isUndefined(item.emptyLineBefore)) {
			return true;
		}

		return _.includes(['always', 'never'], item.emptyLineBefore);
	})) {
		return false;
	}

	return true;
}
