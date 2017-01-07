'use strict'

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-remove-unused', options => { 
	if(!options || !options.classes){ throw new Error('Plugin options must have "classes" property') }

	const patterns = new Set(options.classes);
  
	return root => {
		root.walkRules(rule => {
          	!(rule.selector.match(/\.[a-z0-9\-\_]+/gi) || []).every(cls => patterns.has(cls)) && rule.remove();
		});
	};

});