import { checkChild } from './checkChild.js';

export function isOrderCorrect(node) {
	const allPropData = [];

	return node.every(function isChildCorrect(child) {
		return !checkChild(child, allPropData);
	});
}
