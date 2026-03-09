export function getContainingNode(node) {
	if (node.type === 'rule' || node.type === 'atrule') {
		return node;
	}

	// postcss-styled-syntax: declarations are children of Root node
	if (node.parent?.type === 'root' && node.parent?.raws.isRuleLike) {
		return node.parent;
	}

	// postcss-html `style` attributes: declarations are children of Root node
	if (node.parent?.document?.nodes?.some((item) => item.type === 'root')) {
		return node.parent;
	}

	return node;
}
