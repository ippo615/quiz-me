var perimeter = (function () {

	var formatToInteger = function (x) {
		return x.toFixed(0);
	};

	// -------------------------------------------------------- [ Shape Drawing ] -
	function drawLineWithGap(context, pt1, pt2, fontSize, maxLabelWidth) {
		var dx, dy, mx, my, l, ndx, ndy, gap;
		mx = 0.5 * (pt2.x + pt1.x);
		my = 0.5 * (pt2.y + pt1.y);
		dx = pt2.x - pt1.x;
		dy = pt2.y - pt1.y;
		l = Math.sqrt(dx * dx + dy * dy);
		ndx = dx / l;
		ndy = dy / l;
		gap = Math.abs(ndx * maxLabelWidth);
		if (gap < 1.5 * fontSize) {
			gap = 1.5 * fontSize;
		}
		if (gap < l) {
			context.lineTo(pt1.x + ndx * 0.5 * (l - gap), pt1.y + ndy * 0.5 * (l - gap));
			context.moveTo(pt1.x + ndx * 0.5 * (l - gap) + ndx * gap, pt1.y + ndy * 0.5 * (l - gap) + ndy * gap);
			context.lineTo(pt2.x, pt2.y);
		} else {
			context.moveTo(pt2.x, pt2.y);
		}
	}

	function drawLengthLabel(context, pt1, pt2, formatNumber) {
		var dx, dy, mx, my, l;
		mx = 0.5 * (pt2.x + pt1.x);
		my = 0.5 * (pt2.y + pt1.y);
		dx = pt2.x - pt1.x;
		dy = pt2.y - pt1.y;
		l = Math.sqrt(dx * dx + dy * dy);
		if (l > 0.5) {
			context.fillText(formatNumber(l), mx, my * 1.01);
		}
	}

	function drawThing(points, quiz) {

		var fontSize = 16;
		var maxLabelWidth = fontSize * 5;

		var canvas = quiz.genericCanvas;
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		context.scale(quiz.globalScale, quiz.globalScale);
		context.lineWidth = 4;
		context.lineJoin = 'round';
		context.lineCap = 'round';

		// Draw the fill
		context.fillStyle = quiz.getOption('perimeterFillColor','#0DF');
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		var i, nPoints = points.length;
		for (i = 1; i < nPoints; i += 1) {
			context.lineTo(points[i].x, points[i].y);
		}
		context.closePath();
		context.fill();

		// Draw the stroke
		context.strokeStyle = '#000';
		context.lineWidth = 4;
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		nPoints = points.length;
		for (i = 1; i < nPoints; i += 1) {
			drawLineWithGap(context, points[i - 1], points[i], fontSize, maxLabelWidth);
		}
		drawLineWithGap(context, points[nPoints - 1], points[0], fontSize, maxLabelWidth);
		context.closePath();
		context.stroke();

		// Draw the length labels
		var format = function (x) {
			return x.toFixed(0);
		};
		context.font = fontSize + 'px mono';
		context.fillStyle = '#000';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		for (i = 1; i < nPoints; i += 1) {
			drawLengthLabel(context, points[i - 1], points[i], format);
		}
		drawLengthLabel(context, points[nPoints - 1], points[0], format);

		context.restore();
	}
	var animatePolygonTransition = (function () {
		var polyStart = [];
		var polyEnd = [];
		var startTime = 0;
		var duration = 0;
		var onDoneAction = null;
		var requestAnimFrame = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
				function ( /* function */ callback /*, DOMElement element */ ) {
					window.setTimeout(function () {
						callback();
					}, 16);
			};

		var runAmin = function (timeStamp) {
			//timeStamp = timeStamp || (new Date()).getTime();
			timeStamp = (new Date()).getTime();
			var dt = timeStamp - startTime;
			var percent = 0.5 - (Math.cos(dt / duration * (Math.PI)) / 2);

			var i, nPoints = polyStart.length;

			if (dt < duration) {
				for (i = 0; i < nPoints; i += 1) {
					polygon[i].x = polyStart[i].x + (polyEnd[i].x - polyStart[i].x) * percent;
					polygon[i].y = polyStart[i].y + (polyEnd[i].y - polyStart[i].y) * percent;
				}
				drawThing(polygon, savedQuiz);
				requestAnimFrame(runAmin);
			} else {
				for (i = 0; i < nPoints; i += 1) {
					polygon[i].x = polyEnd[i].x;
					polygon[i].y = polyEnd[i].y;
				}
				drawThing(polygon, savedQuiz);
				if (onDoneAction) {
					onDoneAction();
				}
			}
		};

		return function (start, end, ms, onDone) {
			requestAnimFrame(runAmin);
			polyStart = start;
			polyEnd = end;
			duration = ms;
			startTime = (new Date()).getTime();
			onDoneAction = onDone;
		};
	})();

	// -------------------------------------------------------------- [ Polygon ] -

	function getRandomPoly(nPoints) {
		var i, poly = [];
		for (i = 0; i < nPoints; i += 1) {
			poly.push({
				x: Math.floor(Math.random() * 240),
				y: Math.floor(Math.random() * 240)
			});
		}
		return poly;
	}

	function centerShape(poly, x, y) {
		var xMid = 0;
		var yMid = 0;
		var xMax = -9e99;
		var xMin = 9e99;
		var yMax = -9e99;
		var yMin = 9e99;
		var i, nPts = poly.length;
		for (i = 0; i < nPts; i += 1) {
			if (poly[i].x > xMax) {
				xMax = poly[i].x;
			}
			if (poly[i].x < xMin) {
				xMin = poly[i].x;
			}
			if (poly[i].y > yMax) {
				yMax = poly[i].y;
			}
			if (poly[i].y < yMin) {
				yMin = poly[i].y;
			}
		}
		xMid = 0.5 * (xMax + xMin);
		yMid = 0.5 * (yMax + yMin);
		var dx = x - xMid;
		var dy = y - yMid;
		for (i = 0; i < nPts; i += 1) {
			poly[i].x += dx;
			poly[i].y += dy;
		}
		return poly;
	}

	function addPoints(poly, totalPoints) {
		var i, nPts = poly.length;
		var lastPoint = poly[nPts - 1];
		if (totalPoints < nPts) {
			while (totalPoints > poly.length) {
				poly.pop();
			}
		} else {
			for (i = nPts; i < totalPoints; i += 1) {
				poly.push({
					x: lastPoint.x,
					y: lastPoint.y
				});
			}
		}
		return poly;
	}

	function rectangle(quiz) {
		var xMin = quiz.getOption('perimeterMinX', 50);
		var xMax = quiz.getOption('perimeterMaxX', 100);
		var yMin = quiz.getOption('perimeterMinY', 50);
		var yMax = quiz.getOption('perimeterMaxY', 100);
		var xRange = Math.abs(xMax - xMin);
		var yRange = Math.abs(yMax - yMin);
		var xSize = xMin + Math.random() * xRange;
		var ySize = yMin + Math.random() * yRange;
		return [{
			x: 0,
			y: 0
		}, {
			x: xSize,
			y: 0
		}, {
			x: xSize,
			y: ySize
		}, {
			x: 0,
			y: ySize
		}];
	}

	function parallelogram(quiz) {
		var xMin = quiz.getOption('perimeterMinX', 50);
		var xMax = quiz.getOption('perimeterMaxX', 100);
		var yMin = quiz.getOption('perimeterMinY', 50);
		var yMax = quiz.getOption('perimeterMaxY', 100);
		var xRange = Math.abs(xMax - xMin);
		var yRange = Math.abs(yMax - yMin);
		var xOffset = Math.random() * xRange;
		var xSize = xMin + Math.random() * xRange;
		var ySize = yMin + Math.random() * yRange;
		return [{
			x: xOffset,
			y: 0
		}, {
			x: xOffset + xSize,
			y: 0
		}, {
			x: xSize,
			y: ySize
		}, {
			x: 0,
			y: ySize
		}];
	}

	function square(quiz) {
		var xMin = quiz.getOption('perimeterMinX', 50);
		var xMax = quiz.getOption('perimeterMaxX', 100);
		var yMin = quiz.getOption('perimeterMinY', 50);
		var yMax = quiz.getOption('perimeterMaxY', 100);
		var xRange = Math.abs(xMax - xMin);
		var yRange = Math.abs(yMax - yMin);
		var sizeMin = 0.5 * (xMin + yMin);
		var sizeRange = 0.5 * xRange + yRange;
		var size = sizeMin + Math.random() * sizeRange;
		return [{
			x: 0,
			y: 0
		}, {
			x: size,
			y: 0
		}, {
			x: size,
			y: size
		}, {
			x: 0,
			y: size
		}];
	}

	function trapazoid(quiz) {
		var xMin = quiz.getOption('perimeterMinX', 50);
		var xMax = quiz.getOption('perimeterMaxX', 100);
		var yMin = quiz.getOption('perimeterMinY', 50);
		var yMax = quiz.getOption('perimeterMaxY', 100);
		var xRange = Math.abs(xMax - xMin);
		var yRange = Math.abs(yMax - yMin);
		var base1 = xMin + Math.random() * xRange;
		var base2 = xMin + Math.random() * xRange;
		var baseMid = 0.5 * (base1 + base2);
		var height = yMin + Math.random() * yRange;
		return [{
			x: baseMid - 0.5 * base1,
			y: 0
		}, {
			x: baseMid + 0.5 * base1,
			y: 0
		}, {
			x: baseMid + 0.5 * base2,
			y: height
		}, {
			x: baseMid - 0.5 * base2,
			y: height
		}];
	}

	function triangleDown(quiz) {
		var xMin = quiz.getOption('perimeterMinX', 50);
		var xMax = quiz.getOption('perimeterMaxX', 100);
		var yMin = quiz.getOption('perimeterMinY', 50);
		var yMax = quiz.getOption('perimeterMaxY', 100);
		var xRange = Math.abs(xMax - xMin);
		var yRange = Math.abs(yMax - yMin);
		var base1 = xMin + Math.random() * xRange;
		var base2 = 0;
		var baseMid = 0.5 * (base1 + base2);
		var height = yMin + Math.random() * yRange;
		return [{
			x: baseMid - 0.5 * base1,
			y: 0
		}, {
			x: baseMid + 0.5 * base1,
			y: 0
		}, {
			x: baseMid + 0.5 * base2,
			y: height
		}, {
			x: baseMid - 0.5 * base2,
			y: height
		}];
	}

	function triangleUp(quiz) {
		var xMin = quiz.getOption('perimeterMinX', 50);
		var xMax = quiz.getOption('perimeterMaxX', 100);
		var yMin = quiz.getOption('perimeterMinY', 50);
		var yMax = quiz.getOption('perimeterMaxY', 100);
		var xRange = Math.abs(xMax - xMin);
		var yRange = Math.abs(yMax - yMin);
		var base1 = 0;
		var base2 = xMin + Math.random() * xRange;
		var baseMid = 0.5 * (base1 + base2);
		var height = yMin + Math.random() * yRange;
		return [{
			x: baseMid - 0.5 * base1,
			y: 0
		}, {
			x: baseMid + 0.5 * base1,
			y: 0
		}, {
			x: baseMid + 0.5 * base2,
			y: height
		}, {
			x: baseMid - 0.5 * base2,
			y: height
		}];
	}

	function makeRegularPolygon(radius, sides, angle, quiz) {
		//var radius = quiz.getOption('radius', 50);
		//var sides = quiz.getOption('sides', 5);
		//var angle = quiz.getOption('angle', 0);
		var radOffset = angle * Math.PI / 180;
		var x = quiz.getOption('x', 50);
		var y = quiz.getOption('y', 50);
		var i, poly = [];
		for (i = 0; i < sides; i += 1) {
			poly.push({
				x: x + radius * Math.cos(radOffset + 2 * Math.PI * i / sides),
				y: y + radius * Math.sin(radOffset + 2 * Math.PI * i / sides)
			});
		}
		return poly;
	}

	function regularPolygon(quiz) {
		var xMin = quiz.getOption('perimeterMinX', 50);
		var xMax = quiz.getOption('perimeterMaxX', 100);
		var yMin = quiz.getOption('perimeterMinY', 50);
		var yMax = quiz.getOption('perimeterMaxY', 100);
		var xRange = Math.abs(xMax - xMin);
		var yRange = Math.abs(yMax - yMin);
		var sides = 3 + Math.floor(Math.random() * 10);
		//quiz.options.sides = sides;
		//quiz.options.angle = Math.random() * 360;
		//quiz.options.radius = ((xMin + yMin) + Math.random() * (xRange + yRange)) * 0.5;
		return makeRegularPolygon(
			((xMin + yMin) + Math.random() * (xRange + yRange)) * 0.5,
			sides,
			Math.random() * 360,
			quiz
		);
	}

	function getRandomShape(quiz) {
		var shapes = [];
		var whichQuestion = quiz.getOption('perimeterShape', 'any');

		if (whichQuestion === 'quad' || whichQuestion === 'any') {
			shapes.push(square);
			shapes.push(rectangle);
			shapes.push(trapazoid);
			shapes.push(parallelogram);
		}
		if (whichQuestion === 'tri' || whichQuestion === 'any') {
			shapes.push(triangleDown);
			shapes.push(triangleUp);
		}
		if (whichQuestion === 'poly' || whichQuestion === 'any') {
			shapes.push(regularPolygon);
		}

		var sides = quiz.getOption('sides', 20);
		var xCenter = quiz.getOption('x', 120);
		var yCenter = quiz.getOption('y', 100);
		var shapeIndex = Math.floor(Math.random() * shapes.length);
		var shape = shapes[shapeIndex];
		var poly = shape(quiz);
		poly = centerShape(poly, xCenter, yCenter);
		poly = addPoints(poly, sides);
		return poly;
	}

	function computeCrossProduct(pt1, pt2) {
		return pt1.x * pt2.y - pt2.x * pt1.y;
	}

	function computeArea(pts) {
		var total = 0;
		var i, l = pts.length;
		for (i = 1; i < l; i += 1) {
			total += computeCrossProduct(pts[i - 1], pts[i]);
		}
		total += computeCrossProduct(pts[pts.length - 1], pts[0]);
		return Math.abs(total * 0.5);
	}

	function computeLength(pt1, pt2) {
		var dx = pt2.x - pt1.x;
		var dy = pt2.y - pt1.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function computePerimeter(pts, quiz) {
		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		var total = 0;
		var i, l = pts.length;
		for (i = 1; i < l; i += 1) {
			if (formatNumber) {
				total += parseFloat(formatNumber(computeLength(pts[i - 1], pts[i])));
			} else {
				total += computeLength(pts[i - 1], pts[i]);
			}
		}
		if (formatNumber) {
			total += parseFloat(formatNumber(computeLength(pts[pts.length - 1], pts[0])));
		} else {
			total += computeLength(pts[pts.length - 1], pts[0]);
		}
		return total;
	}

	var polygon = [];
	var i, maxSides = 20;
	for (i = 0; i < maxSides; i += 1) {
		polygon.push({
			x: 0,
			y: 0
		});
	}

	function animateToNewPoly(newPoly, duration, onDone) {
		animatePolygonTransition(polygon, newPoly, duration, onDone);
	}

	function redraw() {
		drawThing(polygon, savedQuiz);
	}

	var savedQuiz = {};

	function perimeterQuestion(quiz) {
		savedQuiz = quiz;

		var formatNumber = quiz.getOption('formatNumber', formatToInteger);
		var poly = getRandomShape(quiz);
		var answer = computePerimeter(poly, quiz);
		var answers = [
			formatNumber(answer),
			formatNumber(answer * 1.01 + 1),
			formatNumber(answer * 0.99 - 1),
			formatNumber(answer * Math.random())
		];
		answer = formatNumber(answer);
		answers = quiz.shuffle(answers);

		quiz.onResize = redraw;

		quiz.choiceSet(1, answers[0], answer === answers[0]);
		quiz.choiceSet(2, answers[1], answer === answers[1]);
		quiz.choiceSet(3, answers[2], answer === answers[2]);
		quiz.choiceSet(4, answers[3], answer === answers[3]);
		quiz.questionNumbers('', '');
		quiz.questionPrompt('Perimeter?');

		animateToNewPoly(poly, 2000, null);
	}

	var options = [];
	options.push({
		name: 'perimeterShape',
		type: 'select',
		config: {
			'Any Shape': 'any',
			'Quadrilateral': 'quad',
			'Regular Polygon': 'poly',
			'Triangle': 'tri'
		}
	});
	options.push({
		'name': 'perimeterFillColor',
		'type': 'select',
		'config': {
			'default': '#0DF',
			'white': '#FFF',
			'red': '#F00',
			'orange': '#F80',
			'yellow': '#FF0',
			'lime': '#0F0',
			'green': '#080',
			'aqua': '#0FF',
			'blue': '#00F',
			'purple': '#F0F',
			'brown': '#a52a2a',
			'gray': '#888',
			'black': '#000'
		}
	});

	return {
		questions: {
			any: perimeterQuestion
		},
		options: options
	};

})();
