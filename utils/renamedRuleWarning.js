const namespace = require('./namespace');

module.exports = function renamedRuleWarning(oldName, newName, result) {
	if (result.stylelint.ruleSeverities.hasOwnProperty(namespace(oldName))) {
		result.warn(
			(
				`"${namespace(oldName)}" has been renamed to "${newName}" in 0.4. Please use the new name.`
			),
			{
				stylelintType: 'deprecation',
			}
		);
	}
};
