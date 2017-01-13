'use strict';

const stylelint = require('stylelint');
const vendor = require('postcss').vendor;
const _ = require('lodash');
const utils = require('../../utils');
const declarationBlockPropertiesSpecifiedOrder = require('../declaration-block-properties-specified-order');

const ruleName = utils.namespace('declaration-block-property-groups-structure');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (property) => `Expected an empty line before property "${property}"`,
	rejected: (property) => `Unexpected an empty line before property "${property}"`
});

function rule(expectation, options) {
	return function (root, result) {
		const validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual: expectation,
				possible: validatePrimaryOption,
			}
		);

		if (!validOptions) {
			return;
		}

		// remove emptyLineBefore from config
		const cleanedConfig = cleanConfig(expectation);
		const runPropertiesOrder = declarationBlockPropertiesSpecifiedOrder(cleanedConfig, options);

		if (!_.isUndefined(result.stylelint.ruleSeverities) && !_.isUndefined(result.stylelint.ruleSeverities[ruleName])) {
			// set the same severity level
			result.stylelint.ruleSeverities[utils.namespace('declaration-block-properties-specified-order')] = result.stylelint.ruleSeverities[ruleName];
		}

		// run declaration-block-properties-order rule
		runPropertiesOrder(root, result);

		const expectedOrder = createExpectedOrder(expectation);

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

			const allNodesData = [];
			let lastKnownGroup = 1;

			node.each(function processEveryNode(child) {
				const nodeData = {
					node: child,
				};

				if (child.type === 'decl') {
					const prop = child.prop;

					nodeData.name = prop;

					if (utils.isStandardSyntaxProperty(prop) && !utils.isCustomProperty(prop)) {
						let unprefixedPropName = vendor.unprefixed(prop);

						// Hack to allow -moz-osx-font-smoothing to be understood
						// just like -webkit-font-smoothing
						if (unprefixedPropName.indexOf('osx-') === 0) {
							unprefixedPropName = unprefixedPropName.slice(4);
						}

						nodeData.group = getGroup(expectedOrder, unprefixedPropName);
					}
				}

				allNodesData.push(nodeData);

				let previousNodeData = _.nth(allNodesData, -2);

				// current node should be a declaration
				if (child.type !== 'decl') {
					return;
				}

				// current node should be a standard declaration
				if (!utils.isStandardSyntaxProperty(nodeData.name) || utils.isCustomProperty(nodeData.name)) {
					return;
				}

				// if previous node is shared-line comment, use second previous node
				if (previousNodeData && previousNodeData.node.type === 'comment' && previousNodeData.node.raw('before').indexOf('\n') === -1) {
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
				if (!utils.isStandardSyntaxProperty(previousNodeData.name) || utils.isCustomProperty(previousNodeData.name)) {
					return;
				}

				checkLines(previousNodeData, nodeData);
			});

			function checkLines(firstPropData, secondPropData) {
				const firstPropIsUnspecified = !firstPropData.group;
				const secondPropIsUnspecified = !secondPropData.group;

				const firstPropGroup = (!firstPropIsUnspecified) ? firstPropData.group : lastKnownGroup;
				const secondPropGroup = (!secondPropIsUnspecified) ? secondPropData.group : lastKnownGroup;

				if (firstPropGroup !== secondPropGroup && !secondPropIsUnspecified) {
					// Get an array of just the property groups, remove any solo properties
					const groups = _.reject(expectation, _.isString);

					// secondProp seperatedGroups start at 2 so we minus 2 to get the 1st item
					// from our groups array
					const emptyLineBefore = _.get(groups[secondPropGroup - 2], 'emptyLineBefore');

					if (!hasEmptyLineBefore(secondPropData.node) && emptyLineBefore === 'always') {
						complain({
							message: messages.expected(secondPropData.name),
							node: secondPropData.node,
						});
					} else if (hasEmptyLineBefore(secondPropData.node) && emptyLineBefore === 'never') {
						complain({
							message: messages.rejected(secondPropData.name),
							node: secondPropData.node,
						});
					}
				}

				lastKnownGroup = secondPropGroup;
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

function createExpectedOrder(input) {
	const order = {};
	let group = 1;

	appendGroup(input);

	function appendGroup(items) {
		items.forEach((item) => appendItem(item));
	}

	function appendItem(item) {
		if (_.isString(item)) {
			order[item] = group;

			return;
		}

		// If item is not a string, it's a group ...
		if (item.emptyLineBefore) {
			group += 1;
		}

		appendGroup(item.properties);

		return;
	}

	return order;
}

function getGroup(expectedOrder, propName) {
	let group = expectedOrder[propName];

	// If prop was not specified but has a hyphen
	// (e.g. `padding-top`), try looking for the segment preceding the hyphen
	// and use that index
	if (!group && propName.lastIndexOf('-') !== -1) {
		const propNamePreHyphen = propName.slice(0, propName.lastIndexOf('-'));

		group = getGroup(expectedOrder, propNamePreHyphen);
	}

	return group;
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

function cleanConfig(initialConfig) {
	return _.flatMap(initialConfig, function (item) {
		if (_.isPlainObject(item)) {
			return item.properties;
		}

		return item;
	});
}

function validatePrimaryOption(actualOptions) {
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

	// Every object-item's "emptyLineBefore" must be "always" or "never"
	// and "properties" should be an array with no items, or with strings
	if (objectItems.every((item) => {
		if (_.isUndefined(item.emptyLineBefore)) {
			return true;
		}

		if (Array.isArray(item.properties)) {
			if (!item.properties.every((property) => _.isString(property))) {
				return false;
			}
		} else {
			return false;
		}

		return _.includes(['always', 'never'], item.emptyLineBefore);
	})) {
		return true;
	}

	return false;
}

rule.primaryOptionArray = true;

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
