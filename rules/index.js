import { rule as order } from './order/index.js';
import { rule as propertiesOrder } from './properties-order/index.js';
import { rule as propertiesAlphabeticalOrder } from './properties-alphabetical-order/index.js';

export const rules = {
	order,
	'properties-order': propertiesOrder,
	'properties-alphabetical-order': propertiesAlphabeticalOrder,
};
