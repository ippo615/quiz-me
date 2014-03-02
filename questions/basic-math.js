var basic_math = (function () {

	function shuffle(things) {
		var nThings = things.length;
		var i, a, b, swap, l = Math.floor(nThings * 0.5);
		for (i = 0; i < l; i += 1) {
			a = Math.floor(Math.random() * nThings);
			b = Math.floor(Math.random() * nThings);
			swap = things[a];
			things[a] = things[b];
			things[b] = swap;
		}
		return things;
	}

	var formatToInteger = function (x) {
		return x.toFixed(0);
	};

	function additionQuestion(quiz) {
		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		var opMin = parseInt(quiz.getOption('additionMin', '0'), 10);
		var opMax = parseInt(quiz.getOption('additionMax', '9999'), 10);
		var op1 = opMin + Math.random() * (opMax - opMin);
		var op2 = opMin + Math.random() * (opMax - opMin);
		var answer = parseFloat(formatNumber(op1)) + parseFloat(formatNumber(op2));
		quiz.askQuestion({
			type: 'number',
			prompt: 'Sum?',
			n1: formatNumber(op1),
			n2: '+'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: [
				formatNumber(answer),
				formatNumber(answer * 1.01 + 1),
				formatNumber(answer * 0.99 - 1),
				formatNumber(answer * Math.random())
			]
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
		quiz.askQuestion({
			type: 'number',
			prompt: 'Difference?',
			n1: formatNumber(op1),
			n2: '-'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: [
				formatNumber(answer),
				formatNumber(answer * 1.01 + 1),
				formatNumber(answer * 0.99 - 1),
				formatNumber(answer * Math.random())
			]
		});
	}

	function multiplicationQuestion(quiz) {
		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		var opMin = parseInt(quiz.getOption('multiplicationMin', '0'), 10);
		var opMax = parseInt(quiz.getOption('multiplicationMax', '15'), 10);
		var op1 = opMin + Math.random() * (opMax - opMin);
		var op2 = opMin + Math.random() * (opMax - opMin);
		var answer = parseFloat(formatNumber(op1)) * parseFloat(formatNumber(op2));
		quiz.askQuestion({
			type: 'number',
			prompt: 'Product?',
			n1: formatNumber(op1),
			n2: '&times;'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: [
				formatNumber(answer),
				formatNumber(answer * 1.01 + 1),
				formatNumber(answer * 0.99 - 1),
				formatNumber(answer * Math.random())
			]
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
		quiz.askQuestion({
			type: 'number',
			prompt: 'Quotient?',
			n1: formatNumber(op1),
			n2: '&divide;'+formatNumber(op2),
			answer: formatNumber(answer),
			choices: [
				formatNumber(answer),
				formatNumber(answer * 1.01 + 1),
				formatNumber(answer * 0.99 - 1),
				formatNumber(answer * Math.random())
			]
		});
	}

	function anyQuestion(quiz) {
		var rn = Math.random();
		if (rn < 0.25) {
			divisionQuestion(quiz);
		} else if (rn < 0.50) {
			multiplicationQuestion(quiz);
		} else if (rn < 0.75) {
			subtractionQuestion(quiz);
		} else {
			additionQuestion(quiz);
		}
	}

	return {
		questions: {
			addition: additionQuestion,
			subtraction: subtractionQuestion,
			multiplication: multiplicationQuestion,
			division: divisionQuestion,
			any: anyQuestion
		},
		options: {}
	};
})();
