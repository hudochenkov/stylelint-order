/**
 * Check whether a property is a Less mixin
 */

export function isLessMixin(node) {
	return node.type === 'atrule' && node.mixin;
}
