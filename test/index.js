'use strict'

const postcss = require('postcss');
const expect = require('chai').expect;
const plugin = require('../index');


describe('postcss-remove-unused', () => {

	describe('Должен удалять все правила в которых присутствует класс которого нет в списке', () => {
	
		it('Если селектор один', () => {
		    return run(p().singleClass.input, p().singleClass.output, { classes: p().singleClass.classes })
		})

		it('Если селекторов несколько', () => {
		    return run(p().manyClasses.input, p().manyClasses.output, { classes: p().manyClasses.classes })
		})

		it('Если селекторы не только классы', () => {
		    return run(p().notOnlyClasses.input, p().notOnlyClasses.output, { classes: p().notOnlyClasses.classes })
		})

		it('Псевдоклассы и псевдоселекторы не учитываются', () => {
		    return run(p().pseudo.input, p().pseudo.output, { classes: p().pseudo.classes })
		})
			
	})

	describe('Должен удалять все правила:', () => {
		
		it('если в переданный массив пуст', () => {
			return run(p().withEmptyArr.input, p().withEmptyArr.output, { classes: p().withEmptyArr.classes })
		})

		it('если в CSS не оказалось подходящих классов', () => {
			return run(p().withoutMatchedValues.input, p().withoutMatchedValues.output, { classes: p().withoutMatchedValues.classes })
		})

		it('если в переданный CSS пуст', () => {
			return run(p().emptyInput.input, p().emptyInput.output, { classes: p().emptyInput.classes })
		})

	})

	it('Должен бросать исключение если не переданны опции или не передан массив', () => {
		return expect(() => Promise.all([
			run(p().singleClass.input, p().singleClass.output, {}),
			run(p().singleClass.input, p().singleClass.output)
		])).to.throw(Error, 'Plugin options must have "classes" property')
	})

})




function p(){
	return {
		singleClass: { 
			input: '.icon {} .button {} .form {}',
			output: '.button {}',
			classes: ['.button']
		},
		manyClasses: { 
			input: '.navbar .button {} .form .icon {} .button .icon {}',
			output: '.button .icon {}',
			classes: ['.button', '.icon']
		},
		pseudo: { 
			input: '.navbar .button:hover {} .form .icon:active {} .button:hover .icon {}',
			output: '.button:hover .icon {}',
			classes: ['.button', '.icon']
		},
		emptyInput: { 
			input: '',
			output: '',
			classes: ['.button', '.icon']
		},
		withoutMatchedValues: {
			input: '.icon {} .button {} .form {}',
			output: '',
			classes: ['.navbar']
		},
		withEmptyArr: {
			input: '.button {} .icon {}',
			output: '',
			classes: []
		},
		notOnlyClasses: {
			input: 'a.button#id {} a.icon#id {} a.form#id {}',
			output: 'a.icon#id {}',
			classes: ['.icon']
		}
	}
} 




function toFormat(code){
	return code.replace(/[\s\t\n]+/gi, '')
}

function run(input, output, options) {
    return postcss([ plugin(options) ]).process(input)
        .then(result => {
            expect(toFormat(result.css)).to.equal(toFormat(output));
            expect(result.warnings().length).to.equal(0);
        })
}