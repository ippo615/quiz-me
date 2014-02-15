// ------------------------------------------------------- [Module: Overlay ] -
// Let's you draw (via mouse/touch) on a canvas
var Overlay = (function () {

    function attachEvent(element, eventStr, callback) {
        var events = eventStr.split(' ');
        var i, l = events.length;
        for (i = 0; i < l; i += 1) {
            if (element.attachEvent) {
                element.attachEvent('on' + events[i], callback);
            } else {
                element.addEventListener(events[i], callback, false);
            }
        }
    }

    function getPointerPositionsIn(e, target) {
        /// Returns an array of {x: y:} objects that represent the x,y
        /// coordinates of the pointers relative to the top, left corner of the
        /// target object.
        /// Example:
        /// domNode.onclick = function(e){
        ///   var positions = GetPointerPositionsInTarget(e);
        ///   // Code that works with positions..
        /// }

        // Note that the target is the 'node on which the event occured'
        // not the 'node on which the event is registered'. For example:
        // <div id='parent'><div id='child'>BLAH</div></div>
        // If you regesiter the event on parent than target could be either
        // parent or child.
        var locations = [], // array of x,y pairs (finger locations)
            nLocations = 0, // number of locations
            nTouches, // number of touches to look through
            mx = 0, // mouse position
            my = 0,
            baseX = 0, // Base object's position
            baseY = 0,
            baseObj,
            i, iLocation, iTouch; // temp for iterating

        //get the original event (jQury changes e)
        //e = e.originalEvent;
        //we need an array of x,y pairs
        //if this is a touch event
        if (e.type === "touchstart" || e.type === "touchmove" || e.type === "touchend") {
            nTouches = e.touches.length;
            for (i = 0; i < nTouches; i += 1) {
                iTouch = e.touches[i];
                locations[nLocations] = {
                    x: iTouch.pageX,
                    y: iTouch.pageY
                };
                nLocations += 1;
            }
            //could also use: (i haven't noticed a difference)
            //t = event.changedTouches[0];
            //get the mouse coordinates on the page
        } else {
            //if we're actually given the page coordinates
            if (e.pageX || e.pageY) {
                //use the page coordinates as the mouse coordinates
                mx = e.pageX;
                my = e.pageY;
            } else if (e.clientX || e.clientY) {
                //compute the page corrdinates
                mx = e.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft;
                my = e.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop;
            }
            locations[nLocations] = {
                x: mx,
                y: my
            };
            nLocations += 1;
        }
        //find the location of the base object
        baseObj = target;
        //as long as we haven't added all of the parents' offsets
        while (baseObj.offsetParent !== null) {
            //add it's offset
            baseX += parseInt(baseObj.offsetLeft, 10);
            baseY += parseInt(baseObj.offsetTop, 10);
            //get the next parent
            baseObj = baseObj.offsetParent;
        }
        //the mouse position within the target object is:
        for (i = 0; i < nLocations; i += 1) {
            iLocation = locations[i];
            locations[i].x = iLocation.x - baseX;
            locations[i].y = iLocation.y - baseY;
        }
        return locations;
    }

    function getOption(options, name, value) {
        if (options.hasOwnProperty(name)) {
            return options[name];
        }
        return value;
    }

    var makeStart = function (that) {
        return function (event) {
			var e = event || window.event;
            that.lastPos = getPointerPositionsIn(e, that.node);
            that.currPos = that.lastPos;
        };
    };
    var makeMove = function (that) {
        return function (event) {
            var e = event || window.event;
            if (that.lastPos) {
                that.lastPos = that.currPos;
                that.currPos = getPointerPositionsIn(e, that.node);

                // Only draw a line if it's longer than 5 units
                //var dx = currPos[0].x - lastPos[0].x;
                //var dy = currPos[0].y - lastPos[0].y;
                //if( dx*dx + dy*dy < 32 ){
                //	currPos = lastPos;
                //	lastPos = tmp;
                //	return;
                //}

                // Draw this segment
                var ctx = that.node.getContext('2d');
                ctx.strokeStyle = that.color;
                ctx.lineWidth = that.size;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(that.lastPos[0].x, that.lastPos[0].y);
                ctx.lineTo(that.currPos[0].x, that.currPos[0].y);
                ctx.stroke();

            }
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
        };
    };
    var makeEnd = function (that) {
        return function (e) {
            that.lastPos = null;
            that.currPos = null;
        };
    };

    var Overlay = function (options) {
        this.node = getOption(options, 'node', null);

		this.colors = getOption(options, 'colors', 'black red yellow green blue').split(' ');
		this.sizes = getOption(options, 'sizes', '4 10 16 1').split(' ');
		var i, l = this.sizes;
		for( i=0; i<l; i+=1 ){
			this.sizes[i] = parseInt(this.sizes[i],10);
		}

		this.colorIndex = parseInt(getOption(options, 'colorIndex', '0'),10);
		this.sizeIndex = parseInt(getOption(options, 'sizeIndex', '0'),10);

        this.color = getOption(options, 'color', this.colors[this.colorIndex]);
        this.size = getOption(options, 'size', this.sizes[this.sizeIndex]);

        this.lastPos = null;
        this.currPos = null;
    };
    Overlay.prototype.setup = function () {
        attachEvent(this.node, 'touchstart mousedown', makeStart(this));
        attachEvent(this.node, 'touchmove mousemove', makeMove(this));
        attachEvent(this.node, 'touchend mouseup mouseout', makeEnd(this));
        return this;
    };
    Overlay.prototype.setColor = function (color) {
        this.color = color;
        return this;
    };
    Overlay.prototype.setSize = function (size) {
        this.size = size;
        return this;
    };
	Overlay.prototype.nextColor = function(){
		this.colorIndex = (this.colorIndex+1) % this.colors.length;
		this.setColor( this.colors[this.colorIndex] );
		return this.colors[this.colorIndex];
	};
	Overlay.prototype.nextSize = function(){
		this.sizeIndex = (this.sizeIndex+1) % this.sizes.length;
		this.setSize( this.sizes[this.sizeIndex] );
		return this.sizes[this.sizeIndex];
	};
    Overlay.prototype.clear = function () {
        var w = this.node.width;
        var h = this.node.height;
        this.node.getContext('2d').clearRect(0, 0, w, h);
        return this;
    };

    return Overlay;

})();

// -------------------------------------------------------------- [ Utility ] -

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

function getOption(options, name, value) {
    if (options.hasOwnProperty(name)) {
        return options[name];
    }
    return value;
}

function hasClass(node, className) {
    return (node.className.indexOf(className) > -1);
}

function addClass(node, className) {
    if (hasClass(node, className)) {
        return;
    }
    node.className += ' ' + className;
}

function delClass(node, classNames) {
    var strNames = classNames.split(/\s+/g);
    var i, l = strNames.length;
    var oldClassName = node.className;
    for (i = 0; i < l; i += 1) {
        oldClassName = oldClassName.replace(new RegExp('((\\s|^)' + strNames[i] + ')|(' + strNames[i] + '(\\s|$))', 'g'), ' ');
    }
    node.className = oldClassName;
}

function findScale(xSize, ySize, xGoal, yGoal) {
    // We'll either to match `xSize` to `xGoal` or `ySize` to `yGoal` so
    // compute a scale for each.
    var xScale = xGoal / xSize;
    var yScale = yGoal / ySize;

    // If xScale makes it too tall we'll have to use yScale
    // and if yScale makes it too wide we'll have to use xScale
    if (xScale * ySize > yGoal) {
        return yScale;
    } else {
        return xScale;
    }
}

// ----------------------------------------------------------- [ UI Binding ] -
var myQuiz;
var Quiz = (function(){

	var doNothing = function(){};

	var Quiz = function(config){
		this.baseSizeX = getOption(config,'baseSizeX',320);
		this.baseSizeY = getOption(config,'baseSizeY',320);
		this.baseFontSize = getOption(config,'baseFontSize',10);
		this.globalScale = 1;

		this.makeQuestion = getOption(config,'makeQuestion',doNothing);
		this.options = getOption(config,'options',{});

		this.onResize = getOption(config, 'onResize', doNothing);

		this.questionType = 'text';

		// Overlay stuff
		this.overlay = null;

		// HTML node stuff 
		this.overlayCanvas = getOption(config,'overlayCanvas',document.getElementById('overlay-canvas'));
		this.genericCanvas = getOption(config,'genericCanvas',document.getElementById('generic-canvas'));
		this.questionContainer = getOption(config,'questionContainer',document.getElementById('question-container'));
		this.globalContainer = getOption(config,'globalContainer',document.getElementById('global-container'));
		this.buttonContainer = getOption(config,'buttonContainer',document.getElementById('btn-container'));
		this.answerContainer = getOption(config,'answerContainer',document.getElementById('answer-choices'));
		this.questionPromptNode = getOption(config,'prompt',document.getElementById('prompt'));
		this.overlayOptionContainer = getOption(config,'overlayOptionContainer',document.getElementById('overlay-options'));

		this.nodeChoices = getOption(config,'nodeChoices',[
			document.getElementById('choice-1'),
			document.getElementById('choice-2'),
			document.getElementById('choice-3'),
			document.getElementById('choice-4')
		]);

		this.newQuestion = function(){
			quizAsk(this);
		};		

		this.setupUi();
	};

	Quiz.prototype.doNothing = function(){};

	Quiz.prototype.questionPrompt = function(text){
		this.questionPromptNode.innerHTML = text;
	};
	Quiz.prototype.questionText = function(text){
		this.questionType = 'text';
		this.questionPrompt('');
		this.questionContainer.innerHTML = '<div style="padding: 0 1em;">'+text+'</div>';
		//this.questionContainer.style.fontSize = '4em';
		this.resize();
	};
	Quiz.prototype.questionLongText = function(text){
		this.questionType = 'text';
		this.questionPrompt('');
		this.questionContainer.innerHTML = '<div style="padding: 0 1em;">'+text+'</div>';
		this.resize();
		// make sure we have enough room for all the text
		//var w = parseFloat( this.questionContainer.style.width );
		// 900px width, 150 characters, 2em
		//this.questionContainer.style.fontSize = (2 * (0.4*(80/text.length)+0.6*(w/900)))+'em';
	};
	Quiz.prototype.questionNumbers = function(top,bottom){
		this.questionType = 'number';
		this.questionContainer.innerHTML = '<div class="number-column no-select">'+
			'<div class="operand-top">'+top+'</div>'+
			'<div class="operand-bottom">'+bottom+'</div>'+
		'</div>';
		this.resize();
	};

	Quiz.prototype.choiceHide = function(index){
		addClass( this.nodeChoices[index-1], 'inactive btn-hidden' );
	};
	Quiz.prototype.choiceShow = function(index){
		delClass( this.nodeChoices[index-1], 'right wrong inactive btn-hidden' );
	};
	Quiz.prototype.choiceSet = function(index,text,isCorrect){
		var node = this.nodeChoices[index-1];
		node.innerHTML = text;
		delClass( node, 'hint' );
		if( isCorrect ){
			addClass( node, 'hint' );
		}
	};
	function answerOnClick(self) {
		return function (event) {
			var e = event || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		    if (hasClass(self, 'hint')) {
		        addClass(self, 'inactive right');
		    } else {
		        addClass(self, 'inactive wrong');
		    }
		    self.blur();
		};
	}
	Quiz.prototype.choiceAnswer = function(index){
		return answerOnClick( this.nodeChoices[index-1] );
	};

	Quiz.prototype.getOption = function(name,value){
    	if( this.options.hasOwnProperty(name) ){
        	return this.options[name];
        }
        var lowerName = name.toLowerCase();
        if( this.options.hasOwnProperty(lowerName) ){
        	return this.options[lowerName];
        }
        return value;
	};
	Quiz.prototype.shuffle = function(things) {
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
	};
	Quiz.prototype.choose = function(things,n){
		var results = [];
		var nEntries = things.length, index, selected = [];
		while( results.length < n ){
			index = Math.floor( Math.random()*nEntries );
			if( !(index in selected) ){
				selected[index] = true;
				results.push( things[index] );
			}
		}
		return results;
	};

	function quizAsk(quiz){
		setTimeout(function () {
			quiz.choiceHide(1);
		}, 0);
		setTimeout(function () {
			quiz.choiceHide(2);
		}, 300);
		setTimeout(function () {
			quiz.choiceHide(3);
		}, 600);
		setTimeout(function () {
			quiz.choiceHide(4);
		}, 900);
		setTimeout(function () {
			quiz.genericCanvas.getContext('2d').clearRect(0,0,quiz.genericCanvas.width,quiz.genericCanvas.height);
			quiz.overlay.clear();
			quiz.makeQuestion(quiz);
		}, 1200);
		setTimeout(function () {
			quiz.choiceShow(4);
		}, 1500);
		setTimeout(function () {
			quiz.choiceShow(3);
		}, 1800);
		setTimeout(function () {
			quiz.choiceShow(2);
		}, 2100);
		setTimeout(function () {
			quiz.choiceShow(1);
		}, 2400);
	}
	function askNewQuestion(quiz){
		return function (event) {
			var e = event || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			quizAsk(quiz);
			quiz.resize();
		};
	}
	Quiz.prototype.setupUi = function(){
		// Register all the onclick handlers for the answer choices
		var i, l=this.nodeChoices.length;
		for( i=0; i<l; i+=1 ){
			this.nodeChoices[i].onclick = this.choiceAnswer(i+1);
		}

		// 
		this.overlay = new Overlay({
		    node: this.overlayCanvas,
			penColors: 'black red yellow green blue',
			penSizes: '4 10 16 1'
		});
		this.overlay.clear();
		this.overlay.setup();

		document.getElementById('pen-size').onclick = function(event){
			var e = event || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			document.getElementById('pen-size').innerHTML = 'Size:'+myQuiz.overlay.nextSize();
		};
		document.getElementById('pen-color').onclick = function(event){
			var e = event || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			document.getElementById('pen-color').innerHTML = myQuiz.overlay.nextColor();
		};
		document.getElementById('new-question').onclick = askNewQuestion(this);
	};

	function resizeCanvas(canvas,xSize,ySize){
		canvas.width = xSize;
		canvas.height = ySize;
	}
	function sizeNode(node,xSize,ySize){
		node.style.width = xSize+'px';
		node.style.height = ySize+'px';
	}

	function computeFontSize(w,h,nLetters){
		return Math.sqrt( w*h / nLetters );
	}

	Quiz.prototype.resize = function(){
		var baseSizeX = this.baseSizeX;
		var baseSizeY = this.baseSizeY;
		var baseSquare = Math.min(baseSizeX, baseSizeY);
		var baseFontSize = this.baseFontSize;

		var globalWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var globalHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		var globalScale = findScale(baseSizeX, baseSizeY, globalWidth, globalHeight);

		this.globalScale = globalScale;

		this.globalContainer.style.fontSize = Math.round(globalScale * baseFontSize)+'px';

		var halfHeight = Math.round(globalHeight*0.5);
		var halfWidth = Math.round(globalWidth*0.5);
		
		resizeCanvas(this.overlayCanvas,globalWidth,globalHeight);
		resizeCanvas(this.genericCanvas,globalWidth,globalHeight);

		sizeNode(this.globalContainer,globalWidth,globalHeight);

		var questionPart = 0.65;
		var answerPart = 0.35;
		var fontSize;

		if( globalWidth > globalHeight ){
			fontSize = computeFontSize(globalWidth*0.5,globalHeight,this.questionContainer.innerHTML.length);
			sizeNode(this.questionContainer,globalWidth*questionPart,globalHeight);		
			sizeNode(this.buttonContainer,globalWidth*answerPart,globalHeight);
			this.buttonContainer.style.top = '0px';
			this.buttonContainer.style.left = (globalWidth*questionPart)+'px';
			delClass(this.answerContainer, 'shrink');
			delClass(this.overlayOptionContainer, 'shrink');
		}else{
			fontSize = computeFontSize(globalWidth,globalHeight*0.5,this.questionContainer.innerHTML.length);
			sizeNode(this.questionContainer,globalWidth,globalHeight*questionPart);		
			sizeNode(this.buttonContainer,globalWidth,globalHeight*answerPart);
			this.buttonContainer.style.top = (globalHeight*0.5)+'px';//(globalHeight*questionPart)+'px';
			this.buttonContainer.style.left = '0px';
			addClass(this.answerContainer, 'shrink');
			addClass(this.overlayOptionContainer, 'shrink');
		}

		if( this.questionType === 'text' ){
			this.questionContainer.style.fontSize = fontSize +'px';
		}else{
			this.questionContainer.style.fontSize = '4em';
		}

		this.onResize();
	};	

	return Quiz;
})();

function getUrlParms(){
	/// Parses the URL for parameters and returns an array of key-value pairs
	var startLocation = window.location.href.indexOf('?');
	var variables = {};
	if( startLocation == -1 ){ return variables; }

	var parmString = window.location.href.slice(startLocation + 1);
	var varStrings = parmString.split('&');

	var tmp, l = varStrings.length;
	for(var i=0; i<l; i+=1){
		// Key/value strings have the form: key=value
		// we'll treat ones without '=' as boolean
		tmp = varStrings[i].split('=');
		if( tmp.length < 1 ){
			variables[unescape(tmp[0]).toLowerCase()] = true;
		}else{
			variables[unescape(tmp[0]).toLowerCase()] = unescape(tmp[1]);
		}
	}

	return variables;
}
