/**
 * Check whether a rule is a SCSS nested properties root
 *
 * a {
 *     margin: { ← nested properties root
 *         left: 10px;
 *     }
 * }
 */

module.exports = function isScssNestedPropertiesRoot(node) {
	return node && node.type === 'rule' && node.selector.slice(-1) === ':';
};
