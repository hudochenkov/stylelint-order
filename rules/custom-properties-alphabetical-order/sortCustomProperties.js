import { beforeDeclaration, afterDeclaration } from './getComments.js';
import { isAllowedToProcess } from './isAllowedToProcess.js';
import { isStandardSyntaxProperty } from '../../utils/isStandardSyntaxProperty.js';
import { isCustomProperty } from '../../utils/isCustomProperty.js';

/**
 * Sort custom properties alphabetically within a node
 * @param {import('postcss').Container} node - The PostCSS node to sort
 */
export function sortCustomProperties(node) {
	if (!isAllowedToProcess(node)) {
		return;
	}

	let allRuleNodes = [];
	let declarations = [];

	node.each((childNode, index) => {
		if (
			childNode.type === 'decl' &&
			isStandardSyntaxProperty(childNode.prop) &&
			isCustomProperty(childNode.prop)
		) {
			let propData = {
				name: childNode.prop.toLowerCase(),
				node: childNode,
				initialIndex: index,
			};

			// add a marker
			childNode.sortProperty = true;

			// If comment on separate line before node, use node's indexes for comment
			let commentsBefore = beforeDeclaration([], childNode.prev(), propData);

			// If comment on same line with the node and node, use node's indexes for comment
			let commentsAfter = afterDeclaration([], childNode.next(), propData);

			declarations = [...declarations, ...commentsBefore, propData, ...commentsAfter];
		}
	});

	// Sort custom properties alphabetically
	declarations.sort((a, b) => {
		if (a.name === b.name) {
			return a.initialIndex - b.initialIndex;
		}

		return a.name <= b.name ? -1 : 1;
	});

	let foundDeclarations = false;

	node.each((childNode) => {
		if (childNode.sortProperty) {
			if (!foundDeclarations) {
				foundDeclarations = true;

				declarations.forEach((item) => {
					allRuleNodes.push(item.node);
				});
			}
		} else {
			allRuleNodes.push(childNode);
		}
	});

	node.removeAll();
	node.append(allRuleNodes);
}
