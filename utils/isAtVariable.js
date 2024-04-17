/**
 * Check whether a property is a @-variable (Less)
 */

export function isAtVariable(node) {
	return node.type === 'atrule' && node.variable;
}
