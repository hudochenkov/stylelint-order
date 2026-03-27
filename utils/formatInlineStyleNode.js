/**
 * Normalizes whitespace for postcss-html inline `style` attributes (`source.inline` on Root).
 * Call after `sortNodeProperties` so `raws` reflect the sorted declarations.
 *
 * Rules:
 * - Each declaration `raws.before`:
 *     if it contains a newline, keep it unchanged;
 *     otherwise use `''` for the first declaration
 *     and ` ` for the rest (single space between inline declarations).
 * - Root `raws.after`:
 *     if it contains a newline, keep it unchanged;
 *     otherwise clear it.
 * - Single-line `after` (no newline): also clear `root.raws.semicolon` so the last `;` is omitted.
 */

/**
 * @param {import('postcss').Root} node — inline-style root from postcss-html
 */
export function formatInlineStyleNode(node) {
	if (node?.type !== 'root' || node.source?.inline !== true || !Array.isArray(node.nodes)) {
		return;
	}

	const declarations = node.nodes.filter((child) => child.type === 'decl');

	if (declarations.length === 0) {
		return;
	}

	if (!node.raws) {
		node.raws = {};
	}

	declarations.forEach((child, index) => {
		if (!child.raws) {
			child.raws = {};
		}

		const before = child.raws.before ?? '';

		if (before.includes('\n')) {
			return;
		}

		child.raws.before = index === 0 ? '' : ' ';
	});

	const after = node.raws.after ?? '';

	node.raws.after = after.includes('\n') ? after : '';

	if (!after.includes('\n')) {
		node.raws.semicolon = false;
	}
}
