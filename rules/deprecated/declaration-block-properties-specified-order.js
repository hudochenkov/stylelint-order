'use strict';

const utils = require('../../utils');

const ruleName = utils.namespace('declaration-block-properties-specified-order');

function rule() {
	return function (root, result) {
		result.warn(
			(
				`"${ruleName}" has been removed in 0.4. Instead use "${utils.namespace('properties-order')}" rule.`
			),
			{
				stylelintType: 'deprecation',
			}
		);
	};
}

rule.primaryOptionArray = true;

module.exports = rule;
module.exports.ruleName = ruleName;
