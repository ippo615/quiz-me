var basic_math = (function () {

	var makeFormattedNumberArray = function(start,end,step,format){
		var i, results = [];
		for( i=start; i<end; i+=step ){
			results.push( format(i) );
		}
		return results;
	};

	var formatToInteger = function (x) {
		return x.toFixed(0);
	};

	function additionQuestion(quiz) {
		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		// Compute the question/answer
		var opMin = parseInt(quiz.getOption('additionMin', '0'), 10);
		var opMax = parseInt(quiz.getOption('additionMax', '9999'), 10);
		var op1 = opMin + Math.random() * (opMax - opMin);
		var op2 = opMin + Math.random() * (opMax - opMin);
		var answer = parseFloat(formatNumber(op1)) + parseFloat(formatNumber(op2));
		// Generate several answer choices
		var opAnswerRange = parseInt(quiz.getOption('basicMathChoiceRange','20'),10);
		var opAnswerStep = parseInt(quiz.getOption('basicMathChoiceStep','1'),10);
		var choices = makeFormattedNumberArray( answer - 0.5*opAnswerRange, answer + 0.5*opAnswerRange, opAnswerStep, formatToInteger );
		// Ask the question
		quiz.askQuestion({
			type: 'number',
			prompt: 'Sum?',
			n1: formatNumber(op1),
			n2: '+'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: choices
		});
	}

	function subtractionQuestion(quiz) {
		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		var opMin = parseInt(quiz.getOption('subtractionMin', '0'), 10);
		var opMax = parseInt(quiz.getOption('subtractionMax', '9999'), 10);
		var op1 = opMin + Math.random() * (opMax - opMin);
		var op2 = opMin + Math.random() * (opMax - opMin);
		op1 = op1 + op2;
		var answer = parseFloat(formatNumber(op1)) - parseFloat(formatNumber(op2));
		var opAnswerRange = parseInt(quiz.getOption('basicMathChoiceRange','20'),10);
		var opAnswerStep = parseInt(quiz.getOption('basicMathChoiceStep','1'),10);
		var choices = makeFormattedNumberArray( answer - 0.5*opAnswerRange, answer + 0.5*opAnswerRange, opAnswerStep, formatToInteger );
		quiz.askQuestion({
			type: 'number',
			prompt: 'Difference?',
			n1: formatNumber(op1),
			n2: '-'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: choices
		});
	}

	function multiplicationQuestion(quiz) {
		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		var opMin = parseInt(quiz.getOption('multiplicationMin', '0'), 10);
		var opMax = parseInt(quiz.getOption('multiplicationMax', '15'), 10);
		var op1 = opMin + Math.random() * (opMax - opMin);
		var op2 = opMin + Math.random() * (opMax - opMin);
		var answer = parseFloat(formatNumber(op1)) * parseFloat(formatNumber(op2));
		var opAnswerRange = parseInt(quiz.getOption('basicMathChoiceRange','20'),10);
		var opAnswerStep = parseInt(quiz.getOption('basicMathChoiceStep','1'),10);
		var choices = makeFormattedNumberArray( answer - 0.5*opAnswerRange, answer + 0.5*opAnswerRange, opAnswerStep, formatToInteger );
		quiz.askQuestion({
			type: 'number',
			prompt: 'Product?',
			n1: formatNumber(op1),
			n2: '&times;'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: choices
		});
	}

	function divisionQuestion(quiz) {
		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		var opMin = parseInt(quiz.getOption('divisionMin', '1'), 10);
		var opMax = parseInt(quiz.getOption('divisionMax', '15'), 10);
		var op1 = opMin + Math.random() * (opMax - opMin);
		var op2 = opMin + Math.random() * (opMax - opMin);
		var prod = parseFloat(formatNumber(op1)) * parseFloat(formatNumber(op2));
		op1 = prod;
		var answer = parseFloat(formatNumber(op1)) / parseFloat(formatNumber(op2));
		var opAnswerRange = parseInt(quiz.getOption('basicMathChoiceRange','8'),10);
		var opAnswerStep = parseInt(quiz.getOption('basicMathChoiceStep','1'),10);
		var choices = makeFormattedNumberArray( answer - 0.5*opAnswerRange, answer + 0.5*opAnswerRange, opAnswerStep, formatToInteger );
		quiz.askQuestion({
			type: 'number',
			prompt: 'Quotient?',
			n1: formatNumber(op1),
			n2: '&divide;'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: choices
		});
	}

	function anyQuestion(quiz) {
		var availableQuestions = [];
		var whichQuestion = quiz.getOption('basicMathQuestion', 'any');

		if (whichQuestion === 'div' || whichQuestion === 'any') {
			availableQuestions.push(divisionQuestion);
		}
		if (whichQuestion === 'mul' || whichQuestion === 'any') {
			availableQuestions.push(multiplicationQuestion);
		}
		if (whichQuestion === 'sub' || whichQuestion === 'any') {
			availableQuestions.push(subtractionQuestion);
		}
		if (whichQuestion === 'add' || whichQuestion === 'any') {
			availableQuestions.push(additionQuestion);
		}

		var question = quiz.choose(availableQuestions, 1)[0];
		question(quiz);
	}

	var options = [];
	options.push({
		name: 'basicMathQuestion',
		type: 'select',
		config: {
			'Any Question': 'any',
			'Addition': 'add',
			'Subtraction': 'sub',
			'Multiplication': 'mul',
			'Division': 'div'
		}
	});

	return {
		questions: {
			addition: additionQuestion,
			subtraction: subtractionQuestion,
			multiplication: multiplicationQuestion,
			division: divisionQuestion,
			any: anyQuestion
		},
		options: options
	};
})();
