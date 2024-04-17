// Check whether a property is a CSS property
import { isCustomProperty } from './isCustomProperty.js';
import { isStandardSyntaxProperty } from './isStandardSyntaxProperty.js';

export function isProperty(node) {
	return (
		node.type === 'decl' && isStandardSyntaxProperty(node.prop) && !isCustomProperty(node.prop)
	);
}
