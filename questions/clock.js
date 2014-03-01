var clock = (function () {
	// draws the face of the clock without the hands
	// need to add parameter for passing in a canvas 2d context
	// perhaps color as well
	function drawClockFace(x, y, r, quiz) {
		var ctx = quiz.getOption('clockContext', null);
		var clockFaceColor = quiz.getOption('clockFaceColor', 'white');
		var clockOutlineColor = quiz.getOption('clockOutlineColor', '#0000AA');
		var clockHourTickColor = quiz.getOption('clockHourTickColor', 'black');
		var clockMinuteTickColor = quiz.getOption('clockMinuteTickColor', 'black');
		ctx.save();
		ctx.clearRect(x - r, y - r, r + r, r + r);
		ctx.translate(x, y);
		ctx.scale(r, r);
		ctx.fillStyle = clockFaceColor;
		ctx.lineCap = "round";
		//note the sizes can be though of as %'s
		//ex 0.1 == 10% so for r=150px -> 15px
		//according to mozilla it is better to use ints
		//so i should change this
		ctx.beginPath();
		ctx.lineWidth = 0.1;
		ctx.strokeStyle = clockOutlineColor;
		ctx.arc(0, 0, 1, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.stroke();

		//draw hour ticks
		ctx.strokeStyle = clockHourTickColor;
		ctx.lineWidth = 0.05;
		ctx.save();
		for (var i = 0; i < 12; i++) {
			ctx.beginPath();
			ctx.rotate(Math.PI / 6);
			ctx.moveTo(0.85, 0);
			ctx.lineTo(0.75, 0);
			ctx.stroke();
		}
		ctx.restore();

		//draw minute ticks
		ctx.strokeStyle = clockMinuteTickColor;
		ctx.lineWidth = 0.025;
		ctx.save();
		for (i = 0; i < 60; i++) {
			ctx.beginPath();
			ctx.rotate(Math.PI / 30);
			ctx.moveTo(0.85, 0);
			ctx.lineTo(0.80, 0);
			ctx.stroke();
		}
		ctx.restore();
		ctx.restore();
	}
	// draw the hour and minutes hands for a particular time
	function drawClockHands(h, m, x, y, r, quiz) {
		var ctx = quiz.getOption('clockContext', null);
		var clockHourHandColor = quiz.getOption('clockHourHandColor', 'black');
		var clockMinuteHandColor = quiz.getOption('clockMinuteHandColor', 'black');
		ctx.save();
		ctx.translate(x, y);
		ctx.scale(r, r);
		ctx.strokeStyle = clockHourHandColor;
		ctx.lineCap = "round";
		//draw hour
		ctx.save();
		ctx.lineWidth = 0.07;
		ctx.beginPath();
		ctx.rotate(-Math.PI / 2 + h * Math.PI / 6);
		ctx.moveTo(0.00, 0);
		ctx.lineTo(0.50, 0);
		ctx.stroke();
		ctx.restore();
		//draw minutes
		ctx.strokeStyle = clockMinuteHandColor;
		ctx.save();
		ctx.lineWidth = 0.07;
		ctx.beginPath();
		ctx.rotate(-Math.PI / 2 + m * Math.PI / 30);
		ctx.moveTo(0.00, 0);
		ctx.lineTo(0.65, 0);
		ctx.stroke();
		ctx.restore();
		ctx.restore();
	}
	//draw the face and hands in one call
	function drawTime(x, y, r, h, m, quiz) {
		drawClockFace(x, y, r, quiz);
		drawClockHands(h, m, x, y, r, quiz);
	}

	function drawTimeIndex(index, quiz) {
		//var index = quiz.getOption('timeIndex', Math.random()*12*60);
		var isContinuous = quiz.getOption('clockIsContinuous', true);
		var scale = quiz.globalScale;
		var hour = (index / 60);
		if (!isContinuous) {
			hour = Math.floor(hour);
		}
		var minute = index % 60;
		//console.info(hour+':'+minute);
		drawTime(120 * scale, 120 * scale, 100 * scale, hour, minute, quiz);
	}

	var animateTimeTransition = (function () {
		var timeStart = [];
		var timeEnd = [];
		var startTime = 0;
		var duration = 0;
		var onDoneAction = null;
		var timeIndex = 0;

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

			if (dt < duration) {
				timeIndex = timeStart + (timeEnd - timeStart) * percent;
				drawTimeIndex(timeIndex, savedQuiz);
				requestAnimFrame(runAmin);
			} else {
				timeIndex = timeEnd;
				drawTimeIndex(timeIndex, savedQuiz);
				if (onDoneAction) {
					onDoneAction();
				}
			}
		};

		return function (start, end, ms, quiz, onDone) {
			requestAnimFrame(runAmin);
			timeStart = start;
			timeEnd = end;
			duration = ms;
			startTime = (new Date()).getTime();
			onDoneAction = onDone;
		};
	})();

	var time = 0;

	function animateToNewTime(newTime, ms, options, onDone) {
		animateTimeTransition(time, newTime, ms, options, onDone);
		time = newTime;
	}
	var savedQuiz = {};

	function redraw() {
		drawTimeIndex(time, savedQuiz);
	}

	function formatTime(time) {
		var hour = Math.floor(time / 60);
		var minute = Math.round(time % 60);
		if (hour === 0) {
			hour = '12';
		}
		if (minute < 10) {
			minute = '0' + minute;
		}
		return hour + ':' + minute;
	}

	function clockQuestion(quiz) {
		quiz.options.clockContext = quiz.genericCanvas.getContext('2d');

		savedQuiz = quiz;

		var minAnswerDeviation = parseFloat(quiz.getOption('minAnswerDeviation', '0.01'));
		var maxAnswerDeviation = parseFloat(quiz.getOption('maxAnswerDeviation', '0.10'));
		var answerDeviationRange = (maxAnswerDeviation - minAnswerDeviation);
		var newTime = Math.round(Math.random() * 12 * 60);
		var answers = [
			formatTime(newTime),
			formatTime(newTime * (1.0 + minAnswerDeviation + Math.random() * answerDeviationRange)),
			formatTime(newTime * (1.0 - minAnswerDeviation - Math.random() * answerDeviationRange)),
			formatTime(newTime * Math.random())
		];
		var answer = formatTime(newTime);
		answers = quiz.shuffle(answers);
		quiz.onResize = redraw;
		quiz.choiceSet(1, answers[0], answer === answers[0]);
		quiz.choiceSet(2, answers[1], answer === answers[1]);
		quiz.choiceSet(3, answers[2], answer === answers[2]);
		quiz.choiceSet(4, answers[3], answer === answers[3]);
		quiz.questionNumbers('', '');
		quiz.questionPrompt('Time?');

		animateToNewTime(newTime, 5000, quiz, quiz.doNothing);
	}

	return {
		questions: {
			any: clockQuestion
		},
		options: {}
	};
})();
