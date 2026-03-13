# custom-properties-alphabetical-order

Specify the alphabetical order of custom properties (CSS variables) within declaration blocks.

```css
a {
	--alpha: 1;
	--beta: 2;
	--gamma: 3;
}
/** ↑
 * These custom properties */
```

This rule only applies to custom properties (properties starting with `--`). Regular CSS properties are ignored by this rule. Use [`properties-alphabetical-order`](../properties-alphabetical-order/README.md) for sorting regular properties.

## Options

### Primary option

Value type: `boolean`.<br>
Default value: none.

```json
{ "order/custom-properties-alphabetical-order": true }
```

The following patterns are considered warnings:

```css
a {
	--beta: 2;
	--alpha: 1;
}
```

```css
a {
	--z-index: 100;
	--color-primary: blue;
	--font-size: 16px;
}
```

The following patterns are *not* considered warnings:

```css
a {
	--alpha: 1;
	--beta: 2;
}
```

```css
a {
	--color-primary: blue;
	--font-size: 16px;
	--z-index: 100;
}
```

```css
/* Custom properties and regular properties can be mixed */
a {
	--alpha: 1;
	--beta: 2;
	color: var(--color-primary);
	font-size: var(--font-size);
}
```

```css
/* Regular properties are not affected by this rule */
a {
	--alpha: 1;
	--beta: 2;
	z-index: 1;
	color: red;
}
```

## Combining with properties-alphabetical-order

This rule can be used alongside `properties-alphabetical-order` to sort both custom properties and regular properties alphabetically:

```json
{
	"order/custom-properties-alphabetical-order": true,
	"order/properties-alphabetical-order": true
}
```

Note that `properties-alphabetical-order` explicitly ignores custom properties, so there is no conflict between these two rules.
