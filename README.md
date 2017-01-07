# PostCSS Remove unused [![Build Status][ci-img]][ci]

[PostCSS] This plugin remove CSS rules that are not contained in JSON like: ['.button', '.someSelector'] 

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/Silvestr-b/postcss-remove-unused.svg
[ci]:      https://travis-ci.org/Silvestr-b/postcss-remove-unused

From:
```css
.button {
    background: #0099cc; 
}
.icon {
	padding: 8px;
}
.button .icon {
	margin: 4px;
}
```
With:
```js
// path/to/file.json
['.button', 'someSelector']
```
To:
```css
.button {
    background: #0099cc; 
}
```

## Usage

```js
const options = {
	file: 'path/to/file.json' 
}

postcss([ require('postcss-remove-unused')(options) ])
```

See [PostCSS] docs for examples for your environment.
