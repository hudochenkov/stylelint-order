# declaration-block-property-groups-structure

Require or disallow an empty line before property groups.

Rule is designed to run [`declaration-block-properties-specified-order`] rule before rule's job is done.

**Don't configure `declaration-block-properties-specified-order` separately, otherwise this rule will run twice.**

Plugin will check empty lines between declaration _only_. However, shared-line comments ignored by plugin. Shared-line comment is a comment on the same line as declaration before this comment.

Given:

```js
[
	{
		"emptyLineBefore": "always",
		"properties": [
			"display"
		]
	},
	{
		"emptyLineBefore": "always",
		"properties": [
			"position"
		]
	}
]
```

This patterns will be checked:

```css
a {
	display: none; /* shared-line comment */

	position: absolute;
}
```

```css
a {
	display: none; /* shared-line comment */
	position: absolute;
}
```

This patterns will _not_ be checked:

```css
a {
	display: none;
	/* not shared-line comment */
	position: absolute;
}
```

```css
a {
	display: none;
	/* not shared-line comment */

	position: absolute;
}
```

## Options

`["array", "of", "unprefixed", "property", "names", "or", "group", "objects"]`

Within an order array, you can include

* unprefixed property names
* group objects with these properties:
	* `properties (array of strings)`: The properties in this group.
	* `emptyLineBefore ("always"|"never")`: If `always`, this group must be separated from other properties by an empty newline. If emptyLineBefore is `never`), the group must have no empty lines separating it from other properties. By default this property isn't set.

Plugin treats properties the same way `declaration-block-properties-specified-order` treats them:

> **By default, unlisted properties will be ignored.** So if you specify an array and do not include `display`, that means that the `display` property can be included before or after any other property. *This can be changed with the `unspecified` option* (see [`declaration-block-properties-specified-order`] docs).

> **If an (unprefixed) property name is not included in your array and it contains a hyphen (e.g. `padding-left`), the rule will look for the string before that first hyphen in your array (e.g. `padding`) and use that position.** This means that you do not have to specify each extension of the root property; you can just specify the root property and the extensions will be accounted for.

> For example, if you have included `border` in your array but not `border-top`, the rule will expect `border-top` to appear in the same relative position as `border`.

> Other relevant rules include `margin`, `border`, `animation`, `transition`, etc.

> Using this fallback, the order of these hyphenated relative to their peer extensions (e.g. `border-top` to `border-bottom`) will be *arbitrary*. If you would like to enforce a specific ordering (e.g. always put `border-right` before `border-left`), you should specify those particular names in your array.

## Examples

Given:

```js
[
	"height",
	{
		"emptyLineBefore": "always",
		"properties": [
			"display"
		]
	},
	{
		"emptyLineBefore": "always",
		"properties": [
			"position"
		]
	},
	{
		"emptyLineBefore": "always",
		"properties": [
			"border-bottom",
			"font-style"
		]
	}
]
```

The following patterns are considered warnings:

```css
a {
	display: none;
	position: absolute;

	border-bottom: 1px solid red;
	font-style: italic;
}
```

```css
a {
	display: none;
	font-style: italic;
}
```

```css
a {
	height: 100px;
	font-style: italic;
}
```

```css
a {
	position: absolute; /* comment */
	border-bottom: 1px solid red;
}
```

The following patterns are _not_ considered warnings:

```css
a {
	display: none;

	position: absolute;

	border-bottom: 1px solid red;
	font-style: italic;
}
```

```css
a {
	display: none;

	font-style: italic;
}
```

```css
a {
	height: 100px;

	font-style: italic;
}
```

```css
a {
	position: absolute; /* comment */

	border-bottom: 1px solid red;
}
```

---


Given:

```js
[
	{
		"properties": [
			"display"
		]
	},
	{
		"emptyLineBefore": "never",
		"properties": [
			"position"
		]
	}
]
```

The following pattern are considered warnings:

```css
a {
	display: none;

	position: absolute;
}
```

The following pattern are _not_ considered warnings:

```css
a {
	display: none;
	position: absolute;
}
```

[`declaration-block-properties-specified-order`]: ../declaration-block-properties-specified-order/README.md
