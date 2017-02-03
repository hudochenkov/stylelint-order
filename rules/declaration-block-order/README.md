# declaration-block-order

Specify the order of content within declaration blocks.

## Options

### Primary option

```js
["array", "of", "keywords", "or", "expanded", "at-rule", "objects"]
```

Within an order array, you can include:

- keywords:
	- `custom-properties` — Custom properties (e. g., `--property: 10px;`)
	- `dollar-variables` — Dollar variables (e. g., `$variable`)
	- `declarations` — CSS declarations (e. g., `display: block`)
	- `rules` — Nested rules (e. g., `a { span {} }`)
	- `at-rules` — Nested at-rules (e. g., `div { @media () {} }`)
- extended at-rules objects:

	```js
	{
		type: 'at-rule',
		name: 'include',
		parameter: 'hello',
		hasBlock: true
	}
	```

**By default, unlisted elements will be ignored.** So if you specify an array and do not include `declarations`, that means that all declarations can be included before or after any other element. _This can be changed with the `unspecified` option (see below)._

#### Extended at-rules objects

Extended at-rules objects have different parameters and variations.

Object parameters:

* `type`: always `"at-rule"`
* `name`: `string`. E. g., `name: "include"` for `@include`
* `parameter`: `string`|`regex`. A string will be translated into a RegExp — `new RegExp(yourString)` — so _be sure to escape properly_. E. g., `parameter: "icon"` for `@include icon(20px);`
* `hasBlock`: `boolean`. E. g., `hasBlock: true` for `@include icon { color: red; }` and not for `@include icon;`

Always specify `name` if `parameter` is specified.

Matches all at-rules:

```js
{
	type: 'at-rule'
}
```

Or keyword `at-rules`.

Matches all at-rules, which have nested elements:

```js
{
	type: 'at-rule',
	hasBlock: true
}
```

Matches all at-rules with specific name:

```js
{
	type: 'at-rule',
	name: 'media'
}
```

Matches all at-rules with specific name, which have nested elements:

```js
{
	type: 'at-rule',
	name: 'media',
	hasBlock: true
}
```

Matches all at-rules with specific name and parameter:

```js
{
	type: 'at-rule',
	name: 'include',
	parameter: 'icon'
}
```

Matches all at-rules with specific name and parameter, which have nested elements:

```js
{
	type: 'at-rule',
	name: 'include',
	parameter: 'icon',
	hasBlock: true
}
```

Each described above variant has more priority than its previous variant. For example, `{ type: 'at-rule', name: 'media' }` will be applied to an element if both `{ type: 'at-rule', name: 'media' }` and `{ type: 'at-rule', hasBlock: true }` can be applied to an element.

### Optional secondary option

```js
unspecified: "top"|"bottom"|"ignore"
```

Thes option only applies if you've defined your own array of elements.

Default behavior is the same as `"ignore"`: an unspecified element can appear before or after any other property.

With `"top"`, unspecified elements are expected _before_ any specified properties. With `"bottom"`, unspecified properties are expected _after_ any specified properties.

## Examples

Given:

```js
["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"]
```

The following patterns are considered warnings:

```css
a {
	top: 0;
	--height: 10px;
	color: pink;
}
```

```css
a {
	@media (min-width: 100px) {}
	display: none;
}
```

The following patterns are _not_ considered warnings:

```css
a {
	--width: 10px;
	$height: 20px;
	display: none;
	span {}
	@media (min-width: 100px) {}
}
```

```css
a {
	--height: 10px;
	color: pink;
	top: 0;
}
```

---

Given:

```js
[
	{
		type: 'at-rule',
		name: 'include',
	},
	{
		type: 'at-rule',
		name: 'include',
		hasBlock: true
	},
	{
		type: 'at-rule',
		hasBlock: true
	},
	{
		type: 'at-rule',
	}
]
```

The following patterns are considered warnings:

```scss
a {
	@include hello {
		display: block;
	}
	@include hello;
}
```

```scss
a {
	@extend .something;
	@media (min-width: 10px) {
		display: none;
	}
}
```

The following patterns are _not_ considered warnings:

```scss
a {
	@include hello;
	@include hello {
		display: block;
	}
	@media (min-width: 10px) {
		display: none;
	}
	@extend .something;
}
```

```scss
a {
	@include hello {
		display: block;
	}
	@extend .something;
}
```

---

Given:

```js
[
	{
		type: 'at-rule',
		name: 'include',
		hasBlock: true
	},
	{
		type: 'at-rule',
		name: 'include',
		parameter: 'icon',
		hasBlock: true
	},
	{
		type: 'at-rule',
		name: 'include',
		parameter: 'icon'
	}
]
```

The following patterns are considered warnings:

```scss
a {
	@include icon {
		display: block;
	}
	@include hello {
		display: none;
	}
	@include icon;
}
```

```scss
a {
	@include icon;
	@include icon {
		display: block;
	}
}
```

The following patterns are _not_ considered warnings:

```scss
a {
	@include hello {
		display: none;
	}
	@include icon {
		display: block;
	}
	@include icon;
}
```

```scss
a {
	@include hello {
		display: none;
	}
	@include icon;
}
```

---

Given:

```js
[
	'custom-properties',
	{
		type: 'at-rule',
		hasBlock: true,
	},
	'declarations'
]
```

The following patterns are considered warnings:

```css
a {
	@media (min-width: 10px) {
		display: none;
	}
	--height: 10px;
	width: 20px;
}
```

```css
a {
	width: 20px;
	@media (min-width: 10px) {
		display: none;
	}
	--height: 10px;
}
```

```css
a {
	width: 20px;
	@media (min-width: 10px) {
		display: none;
	}
}
```

The following patterns are _not_ considered warnings:

```css
a {
	--height: 10px;
	@media (min-width: 10px) {
		display: none;
	}
	width: 20px;
}
```

```css
a {
	@media (min-width: 10px) {
		display: none;
	}
	width: 20px;
}
```

```css
a {
	--height: 10px;
	width: 20px;
}
```

---

Given:

```js
[
	[
		"declarations"
	],
	{
		unspecified: "ignore"
	}
]
```

The following patterns are _not_ considered warnings:

```css
a {
	--height: 10px;
	display: none;
	$width: 20px;
}
```

```css
a {
	--height: 10px;
	$width: 20px;
	display: none;
}
```

```css
a {
	display: none;
	--height: 10px;
	$width: 20px;
}
```

---

Given:

```js
[
	[
		"declarations"
	],
	{
		unspecified: "top"
	}
]
```

The following patterns are considered warnings:

```css
a {
	display: none;
	--height: 10px;
	$width: 20px;
}
```

```css
a {
	--height: 10px;
	display: none;
	$width: 20px;
}
```

The following patterns are _not_ considered warnings:

```css
a {
	--height: 10px;
	$width: 20px;
	display: none;
}
```

```css
a {
	$width: 20px;
	--height: 10px;
	display: none;
}
```

---

Given:

```js
[
	[
		"declarations"
	],
	{
		unspecified: "bottom"
	}
]
```

The following patterns are considered warnings:

```css
a {
	--height: 10px;
	$width: 20px;
	display: none;
}
```

```css
a {
	--height: 10px;
	display: none;
	$width: 20px;
}
```

The following patterns are _not_ considered warnings:

```css
a {
	display: none;
	--height: 10px;
	$width: 20px;
}
```

```css
a {
	display: none;
	$width: 20px;
	--height: 10px;
}
```
