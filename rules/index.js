module.exports = {
	'order': require('./order'),
	'properties-order': require('./properties-order'),
	'properties-alphabetical-order': require('./properties-alphabetical-order'),

	// Deprecated
	'declaration-block-order': require('./order'),
	'declaration-block-properties-order': require('./properties-order'),
	'declaration-block-properties-alphabetical-order': require('./properties-alphabetical-order'),
	'declaration-block-properties-specified-order': require('./deprecated/declaration-block-properties-specified-order'),
	'declaration-block-property-groups-structure': require('./deprecated/declaration-block-property-groups-structure'),
};
