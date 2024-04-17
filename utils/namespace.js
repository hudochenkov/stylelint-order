const prefix = 'order';

export function namespace(ruleName) {
	return `${prefix}/${ruleName}`;
}
