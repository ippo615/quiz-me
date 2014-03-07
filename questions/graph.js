var graph = (function () {

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

	function polyMul(aPoly, bPoly) {
		var a, al = aPoly.length;
		var b, bl = bPoly.length;
		var newPoly = [];
		var n, nl = al + bl;
		for (n = 0; n < nl; n += 1) {
			newPoly.push(0);
		}
		for (a = 0; a < al; a += 1) {
			for (b = 0; b < bl; b += 1) {
				newPoly[a + b] += aPoly[a] * bPoly[b];
			}
		}
		return newPoly;
	}

	function polyDiv(aPoly, bPoly) {
		var a, al = aPoly.length;
		var b, bl = bPoly.length;
		var newPoly = [];
		var n, nl = al + bl;
		for (n = 0; n < nl; n += 1) {
			newPoly.push(0);
		}
		for (a = 0; a < al; a += 1) {
			for (b = 0; b < bl; b += 1) {
				newPoly[a + b] += aPoly[a] / bPoly[b];
			}
		}
		return newPoly;
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
						symbols.push(symbol + '<sup>' + i + '</sup>');
					} else {
						symbols.push(poly[i] + symbol + '<sup>' + i + '</sup>');
					}
				} else {
					symbols.push(poly[i] + symbol + '<sup>' + i + '</sup>');
				}
			}
		}
		str = symbols.join('+');
		str = str.replace(/\+-/g, '-');
		return str;
	}

	console.info(polyToEquation(polyDiv(polyMul([1, 1, 1], [1, 0]), [1, 0]), 'x')); // 

	/*
	console.info( polyToEquation( polyMul([1,1,1],[1,0]), 'x' ) ); // 
	console.info( polyToEquation( polyMul([0,0,1],[0,0,1]), 'x' ) ); //
	console.info( polyToEquation( polyMul([1,1],[1,1]), 'x' ) ); // (x+1)**2
	console.info( polyToEquation( polyMul([0,1],[0,1]), 'x' ) ); // (x)**2

	console.info( polyEval( [1,1,1], 0) );
	console.info( polyEval( [1,1,1], 1) );
	console.info( polyEval( [0,2,0], 1) );
	console.info( polyEval( [0,0,2], 1) );
	console.info( polyEval( [0,0,1], 2) );
	console.info( polyToEquation( [0,0,1], 'x' ) );
	console.info( polyToEquation( [5,1], 'x' ) );
	console.info( polyToEquation( [3,0,-2], 'x' ) );
	console.info( polyToEquation( [1,1,0,12], 'x' ) );
	*/

	//console.info( polyToEquation( [1,1,1,1], 'x' ) );
	//console.info( polyToEquation( polyDiff(polyDiff([1,1,1,1])), 'x' ) );

	function remap(fromValue, fromMin, fromMax, toMin, toMax) {

		// Compute the range of the data
		var fromRange = fromMax - fromMin;
		var toRange = toMax - toMin;

		// If either range is 0, then the value can only be mapped to 1 value
		if (fromRange === 0) {
			return toMin + toRange / 2;
		}
		if (toRange === 0) {
			return toMin;
		}

		// (1) untranslate, (2) unscale, (3) rescale, (4) retranslate
		var toValue = (fromValue - fromMin) / fromRange;
		toValue = (toRange * toValue) + toMin;

		return toValue;
	}

	function polyDraw(poly, quiz) {

		var canvas = quiz.genericCanvas;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Theorectical funciton range
		var xMin = -10;
		var xMax = 10;
		var yMin = -10;
		var yMax = 10;

		var xSize = 320 * quiz.globalScale; //canvas.width;
		var ySize = 320 * quiz.globalScale; //canvas.height;

		var x, y, xFn, yFn;
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 4.0 * quiz.globalScale;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'black';
		for (x = 1; x < xSize; x += 1) {
			xFn = remap(x, 0, xSize, xMin, xMax);
			yFn = polyEval(poly, xFn);
			//yFn = 5*Math.sin(0.1*2*Math.PI*xFn);
			y = remap(yFn, yMin, yMax, 0, ySize);
			ctx.lineTo(x, ySize - y);
		}
		ctx.stroke();

		// Draw a grid
		ctx.globalAlpha = 0.2;
		ctx.lineWidth = 1.0;
		for (xFn = xMin; xFn < xMax; xFn += 1) {
			x = Math.round(remap(xFn, xMin, xMax, 0, xSize)) + 0.5;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, ySize);
			ctx.stroke();
		}
		for (yFn = yMin; yFn < yMax; yFn += 1) {
			y = Math.round(remap(yFn, yMin, yMax, 0, ySize)) + 0.5;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(xSize, y);
			ctx.stroke();
		}
		// Draw the origin
		ctx.lineWidth = 3.0;
		ctx.globalAlpha = 0.5;
		x = Math.round(remap(0, xMin, xMax, 0, xSize)) + 0.5;
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, ySize);
		ctx.stroke();
		y = Math.round(remap(0, yMin, yMax, 0, ySize)) + 0.5;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(xSize, y);
		ctx.stroke();

		ctx.restore();
	}

	var saved = {};

	function redraw() {
		polyDraw(saved.poly, saved.quiz);
	}

	function askPoly(poly, choices, quiz) {
		saved.poly = poly;
		saved.quiz = quiz;
		var answer = 'y=' + polyToEquation(poly, 'x');
		quiz.askQuestion({
			question: '',
			answer: answer,
			choices: choices,
			redraw: redraw
		});
	}

	function randomPolynomial(order, quiz) {
		var valMin = parseFloat(quiz.getOption('graphCoefficientMin', '-5.0'));
		var valMax = parseFloat(quiz.getOption('graphCoefficientMax', '5.0'));
		var valRange = valMax - valMin;
		var poly = [];
		var i;
		for (i = 0; i <= order; i += 1) {
			poly.push(Math.round(valMin + valRange * Math.random()));
		}
		return poly;
	}

	function constant(quiz) {
		var poly = randomPolynomial(0, quiz);
		var choices = [];
		var i;
		for (i = 0; i < 20; i += 1) {
			choices.push('y=' + polyToEquation(randomPolynomial(0, quiz), 'x'));
		}
		askPoly(poly, choices, quiz);
	}

	function linear(quiz) {
		var poly = randomPolynomial(1, quiz);
		var choices = [];
		var i;
		for (i = 0; i < 20; i += 1) {
			choices.push('y=' + polyToEquation(randomPolynomial(1, quiz), 'x'));
		}
		askPoly(poly, choices, quiz);
	}

	function quadratic(quiz) {
		var poly = randomPolynomial(2, quiz);
		var choices = [];
		var i;
		for (i = 0; i < 20; i += 1) {
			choices.push('y=' + polyToEquation(randomPolynomial(2, quiz), 'x'));
		}
		askPoly(poly, choices, quiz);
	}

	function power(quiz) {
		var polys = [
			[0, 1],
			[0, 0, 1],
			[0, 0, 0, 1],
			[0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 1]
		];
		var poly = quiz.choose(polys, 1)[0];
		var i, l = polys.length;
		var choices = [];
		for (i = 0; i < l; i += 1) {
			choices.push('y=' + polyToEquation(polys[i], 'x'));
		}
		askPoly(poly, choices, quiz);
	}

	function any(quiz) {

		var availableQuestions = [];
		var whichQuestion = quiz.getOption('graphQuestion', 'any');

		if (whichQuestion === 'simple' || whichQuestion === 'any') {
			availableQuestions.push(power);
		}
		if (whichQuestion === 'constant' || whichQuestion === 'any') {
			availableQuestions.push(constant);
		}
		if (whichQuestion === 'linear' || whichQuestion === 'any') {
			availableQuestions.push(linear);
		}
		if (whichQuestion === 'quadratic' || whichQuestion === 'any') {
			availableQuestions.push(quadratic);
		}

		var question = quiz.choose(availableQuestions, 1)[0];
		question(quiz);

	}

	var options = [];
	options.push({
		name: 'graphQuestion',
		type: 'select',
		config: {
			'Any Question': 'any',
			'Simple': 'simple',
			'Constant': 'constant',
			'Linear': 'linear',
			'Quadratic': 'quadratic'
		}
	});

	return {
		questions: {
			any: any,
			constant: constant,
			linear: linear,
			quadratic: quadratic,
			power: power
		},
		options: options
	};
})();
