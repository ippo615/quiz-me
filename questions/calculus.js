var calculus = (function () {

	// for ascii math conversion
	var _tempNode = document.createElement('div');

	function makeMathText(str){
		_tempNode.innerHTML = '`'+str+'`';
		asciiMath.processNode( _tempNode );
		return _tempNode.innerHTML;
	}

	function polyEval(poly, x) {
		var i = poly.length;
		var val = 0;
		while (i--) {
			val += poly[i] * Math.pow(x, i);
		}
		return val;
	}

	function polyDiff(poly) {
		var i, l = poly.length;
		var newPoly = [];
		for (i = 1; i < l; i += 1) {
			newPoly.push(poly[i] * i);
		}
		return newPoly;
	}
	function polyOrder(poly) {
		var order = 0;
		var i, l = poly.length;
		for (i = 0; i < l; i += 1) {
			if (poly[i] !== 0) {
				order = i;
			}
		}
		return order;
	}

	function polyToEquation(poly, symbol) {
		var str = '';
		var i, l = poly.length;
		var isAllZero = true;
		for (i = 0; i < l; i += 1) {
			if (poly[i] !== 0) {
				isAllZero = false;
			}
		}
		if (isAllZero) {
			return '0';
		}
		var symbols = [];
		if (l >= 1 && poly[0] !== 0) {
			symbols.push(poly[0]);
		}
		if (l >= 2 && poly[1] !== 0) {
			symbols.push(poly[1] + symbol);
		}
		for (i = 2; i < l; i += 1) {
			if (poly[i] !== 0) {
				if (poly[i] > 0) {
					if (poly === 1) {
						symbols.push(symbol + '^' + i);
					} else {
						symbols.push(poly[i] + symbol + '^' + i);
					}
				} else {
					symbols.push(poly[i] + symbol + '^' + i);
				}
			}
		}
		str = symbols.join('+');
		str = str.replace(/\+-/g, '-');
		return str;
	}

	function randomPolynomial(order, quiz) {
		var valMin = parseFloat(quiz.getOption('polynomialCoefficientMin', '-9.0'));
		var valMax = parseFloat(quiz.getOption('polynomialCoefficientMax', '9.0'));
		var valRange = valMax - valMin;
		var poly = [];
		var i;
		for (i = 0; i <= order; i += 1) {
			poly.push(Math.round(valMin + valRange * Math.random()));
		}
		return poly;
	}
	function polynomialQuestion(quiz) {
		var orderMin = parseInt(quiz.getOption('polynomialOrderMin', '1'), 10);
		var orderMax = parseInt(quiz.getOption('polynomialOrderMax', '4'), 10);
		var polySymbol = quiz.getOption('polynomialSymbol', 'x');
		var order = Math.round(orderMin + Math.random() * (orderMax - orderMin));

		var p1 = randomPolynomial(order, quiz);
		var polyDif = polyDiff(p1);
		var choiceOrder = polyOrder(polyDif);
		var answer = makeMathText(polyToEquation(polyDif, polySymbol));
		var choices = [
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol)),
			makeMathText(polyToEquation(randomPolynomial(choiceOrder, quiz), polySymbol))
		];
		quiz.askQuestion({
			//question: 'Differentiate:<br/> ' + polyToEquation(p1, polySymbol)+'',
			question: makeMathText('d/d'+polySymbol+' (' + polyToEquation(p1, polySymbol)+')'),
			answer: answer,
			choices: choices
		});
	}

	function randomExponential(quiz){
		// d/dx c^(a*x) = c^(a*x)*ln(c*a) [c > 0]
		var c = Math.ceil(Math.random()*9);
		var a = Math.round(-5+Math.random()*10) || -1;
		return [c,a];
	}
	function exponentialEquationReg(exp,quiz){
		var c = exp[0];
		var a = exp[1];
		var sym = quiz.getOption('calculusSymbol','x');
		return c+'^('+a+'*'+sym+')';
	}
	function exponentialEquationDiff(exp,quiz){
		var c = exp[0];
		var a = exp[1];
		var sym = quiz.getOption('calculusSymbol','x');
		return a+'*'+c+'^('+a+'*'+sym+')*ln('+c+')';
	}
	function exponentialQuestion(quiz) {
		var symbol = quiz.getOption('calculusSymbol','x');
		var p = randomExponential(quiz);
		var answer = makeMathText(exponentialEquationDiff(p, quiz));
		var choices = [
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz)),
			makeMathText(exponentialEquationDiff(randomExponential(quiz),quiz))
		];
		quiz.askQuestion({
			//question: 'Differentiate:<br/> ' + polyToEquation(p1, polySymbol)+'',
			question: makeMathText('d/d'+symbol+' (' + makeMathText(exponentialEquationReg(p,quiz))+')'),
			answer: answer,
			choices: choices
		});
	}


	function any(quiz) {

		var availableQuestions = [];
		var whichQuestion = quiz.getOption('calculusQuestion', 'any');

		if (whichQuestion === 'polynomial' || whichQuestion === 'any') {
			availableQuestions.push(polynomialQuestion);
		}
		if (whichQuestion === 'exponential' || whichQuestion === 'any') {
			availableQuestions.push(exponentialQuestion);
		}

		var question = quiz.choose(availableQuestions, 1)[0];
		question(quiz);
	}

	var options = [];
	options.push({
		name: 'calculusQuestion',
		type: 'select',
		config: {
			'Any Question': 'any',
			'Polynomial': 'polynomial',
			'Exponential': 'exponential'
		}
	});

	return {
		questions: {
			any: any,
			polynomial: polynomialQuestion
		},
		options: options
	};
})();
