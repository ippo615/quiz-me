var fractionQuestion = (function(){

	var saved = {
		d1: 1,
		d2: 1,
		n1: 1,
		n2: 1,
		quiz: null
	};

	function redrawPair(){
		var d1 = saved.d1;
		var d2 = saved.d2;
		var n1 = saved.n1;
		var n2 = saved.n2;
		var quiz = saved.quiz;

		var r = 40;
		var padding = 10;
		var x1 = (160-r-padding)*quiz.globalScale;
		var y1 = 160*quiz.globalScale;
		var x2 = (160+r+padding)*quiz.globalScale;
		var y2 = 160*quiz.globalScale;
		drawFraction(x1,y1,r*quiz.globalScale,n1,d1,quiz);
        drawFraction(x2,y2,r*quiz.globalScale,n2,d2,quiz);
	}
	function redrawSingle(){
		var d = saved.d1;
		var n1 = saved.n1;
		var quiz = saved.quiz;
		drawFraction(110*quiz.globalScale,100*quiz.globalScale,60*quiz.globalScale,n1,d,quiz);
	}

	function simplePic(quiz){
        
        var maxDenominator = parseInt( quiz.getOption('fractionMaxDenominator','12' ), 10 );
        var minDenominator = parseInt( quiz.getOption('fractionMinDenominator','1' ), 10 );

        var d = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var n1 = Math.round( d*Math.random() );

		// Generate all answers from min to max
		var i, possibleAnswers = [];
		for( i=0; i<maxDenominator; i+=1 ){
			possibleAnswers.push(i+'/'+d);
		}

		// Get correct one and 3 more answers then shuffle all for randomness
		var answer = n1 +'/'+ d;
		if( n1 < possibleAnswers.length ){
			possibleAnswers.splice( n1, 1 );
		}
		var answers = quiz.choose( possibleAnswers, 3 );
		answers.push( answer );
		answers = quiz.shuffle( answers );

		quiz.onResize = quiz.doNothing;
		quiz.choiceSet(1,answers[0], answer===answers[0]);
		quiz.choiceSet(2,answers[1], answer===answers[1]);
		quiz.choiceSet(3,answers[2], answer===answers[2]);
		quiz.choiceSet(4,answers[3], answer===answers[3]);
		quiz.questionNumbers( '', '' );
		quiz.questionPrompt( 'Value?' );

		// Save the parameters for redrawing durring a resize
		saved.d1 = d;
		saved.n1 = n1;
		saved.quiz = quiz;

    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		quiz.onResize = redrawSingle;
		redrawSingle();
    }

	function simpleAdd(quiz){
        
        var maxDenominator = parseInt( quiz.getOption('fractionMaxDenominator','12' ), 10 );
        var minDenominator = parseInt( quiz.getOption('fractionMinDenominator','1' ), 10 );

        var d = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var n1 = Math.round( d*Math.random() );
        var n2 = Math.round( d*Math.random() );

		var numeratorSum = n1+n2;

		// Generate all answers from min to max
		var i, possibleAnswers = [];
		for( i=0; i<maxDenominator; i+=1 ){
			possibleAnswers.push(i+'/'+d);
		}

		// Get correct one and 3 more answers then shuffle all for randomness
		var answer = numeratorSum +'/'+ d;
		if( numeratorSum < possibleAnswers.length ){
			possibleAnswers.splice( numeratorSum, 1 );
		}
		var answers = quiz.choose( possibleAnswers, 3 );
		answers.push( answer );
		answers = quiz.shuffle( answers );

		quiz.onResize = quiz.doNothing;
		quiz.choiceSet(1,answers[0], answer===answers[0]);
		quiz.choiceSet(2,answers[1], answer===answers[1]);
		quiz.choiceSet(3,answers[2], answer===answers[2]);
		quiz.choiceSet(4,answers[3], answer===answers[3]);
		quiz.questionNumbers( n1+'/'+d, '+'+n2+'/'+d );
		quiz.questionPrompt( 'Sum?' );

		// Save the parameters for redrawing durring a resize
		saved.d1 = d;
		saved.d2 = d;
		saved.n1 = n1;
		saved.n2 = n2;
		saved.quiz = quiz;

    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		quiz.onResize = redrawPair;
		redrawPair();
    }
	function simpleSub(quiz){
        
        var maxDenominator = parseInt( quiz.getOption('fractionMaxDenominator','12' ), 10 );
        var minDenominator = parseInt( quiz.getOption('fractionMinDenominator','1' ), 10 );

        var d = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var n1 = Math.round( d*Math.random() );
        var n2 = Math.round( n1*Math.random() );

		var numeratorDiff = n1-n2;

		// Generate all answers from min to max
		var i, possibleAnswers = [];
		for( i=0; i<maxDenominator; i+=1 ){
			possibleAnswers.push(i+'/'+d);
		}

		// Get correct one and 3 more answers then shuffle all for randomness
		var answer = numeratorDiff +'/'+ d;
		if( numeratorDiff < possibleAnswers.length ){
			possibleAnswers.splice( numeratorDiff, 1 );
		}
		var answers = quiz.choose( possibleAnswers, 3 );
		answers.push( answer );
		answers = quiz.shuffle( answers );

		quiz.choiceSet(1,answers[0], answer===answers[0]);
		quiz.choiceSet(2,answers[1], answer===answers[1]);
		quiz.choiceSet(3,answers[2], answer===answers[2]);
		quiz.choiceSet(4,answers[3], answer===answers[3]);
		quiz.questionNumbers( n1+'/'+d, '-'+n2+'/'+d );
		quiz.questionPrompt( 'Difference?' );

		// Save the parameters for redrawing durring a resize
		saved.d1 = d;
		saved.d2 = d;
		saved.n1 = n1;
		saved.n2 = n2;
		saved.quiz = quiz;

    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		quiz.onResize = redrawPair;
		redrawPair();
    }
	function complexAdd(quiz){
        
        var maxDenominator = parseInt( quiz.getOption('fractionMaxDenominator','12' ), 10 );
        var minDenominator = parseInt( quiz.getOption('fractionMinDenominator','1' ), 10 );

        var d1 = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var d2 = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var n1 = Math.round( Math.random()*d1 );
        var n2 = Math.round( Math.random()*d2 );
		var top = n1*d2+n2*d1;
		var bot = d1*d2;

		// Generate all answers from min to max
		var i, possibleAnswers = [];
		for( i=0; i<bot; i+=1 ){
			possibleAnswers.push(i+'/'+bot);
		}

		// Get correct one and 3 more answers then shuffle all for randomness
		var answer = top +'/'+ bot;
		if( top < possibleAnswers.length ){
			possibleAnswers.splice( top, 1 );
		}
		var answers = quiz.choose( possibleAnswers, 3 );
		answers.push( answer );
		answers = quiz.shuffle( answers );

		quiz.choiceSet(1,answers[0], answer===answers[0]);
		quiz.choiceSet(2,answers[1], answer===answers[1]);
		quiz.choiceSet(3,answers[2], answer===answers[2]);
		quiz.choiceSet(4,answers[3], answer===answers[3]);
		quiz.questionNumbers( n1+'/'+d1, '+'+n2+'/'+d2 );
		quiz.questionPrompt( 'Sum?' );

		// Save the parameters for redrawing durring a resize
		saved.d1 = d1;
		saved.d2 = d2;
		saved.n1 = n1;
		saved.n2 = n2;
		saved.quiz = quiz;

    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		quiz.onResize = redrawPair;
		redrawPair();
    }
	function _complexSum(quiz){
    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        
        var maxDenominator = parseInt( quiz.getOption('fractionMaxDenominator','12' ), 10 );
        var minDenominator = parseInt( quiz.getOption('fractionMinDenominator','1' ), 10 );
        var maxNumerator = parseInt( quiz.getOption('fractionMaxNumerator','6' ), 10 );
        var minNumerator = parseInt( quiz.getOption('fractionMinNumerator','0' ), 10 );

        var d1 = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var d2 = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var n1 = Math.round( minNumerator + Math.random()*(maxNumerator-minNumerator) );
        var n2 = Math.round( minNumerator + Math.random()*(maxNumerator-minNumerator) );
		var numeratorSum = n1+n2;

		// Generate all answers from min to max
		var i, possibleAnswers = [];
		for( i=0; i<maxDenominator; i+=1 ){
			possibleAnswers.push(i+'/'+d);
		}

		// Get correct one and 3 more answers then shuffle all for randomness
		var answer = possibleAnswers.slice(numeratorSum,numeratorSum+1);
		var answers = quiz.choose( possibleAnswers, 3 );
		answers.push( answer );
		answers = quiz.shuffle( answers );

		quiz.onResize = quiz.doNothing;
		quiz.choiceSet(1,answers[0], answer===answers[0]);
		quiz.choiceSet(2,answers[1], answer===answers[1]);
		quiz.choiceSet(3,answers[2], answer===answers[2]);
		quiz.choiceSet(4,answers[3], answer===answers[3]);
		quiz.questionNumbers( n1+'/'+d, '+'+n2+'/'+d );
		quiz.questionPrompt( 'Sum?' );

        drawFraction(60,60,50,n1,d,quiz);
        drawFraction(180,60,50,n2,d,quiz);
    }
    function drawFraction(x,y,r,numerator,denominator,quiz){
      	var canvas = quiz.genericCanvas;
        var ctx = canvas.getContext('2d');
        var fractionOutlineColor = quiz.getOption('fractionOutlineColor','#000');
        var fractionFillColor = quiz.getOption('fractionFillColor','#0DF');
        var fractionEmptyColor = quiz.getOption('fractionEmptyColor','#FFF');
        var fractionLineColor = quiz.getOption('fractionLineColor','#000');
        
		ctx.save();
		//ctx.translate(x,y);
		//ctx.scale(r,r);
		if( denominator > 1 ){
		    // Draw the filled stuff
			ctx.fillStyle = fractionFillColor;
		    ctx.strokeStyle = fractionLineColor;
			ctx.lineCap = "round";
			ctx.lineWidth = 0.05*r;
		    ctx.save();	
		    var i;
			for (i=0; i<numerator; i++){
				ctx.beginPath();
				//ctx.rotate(2*Math.PI/fractionDemonimator);
				ctx.moveTo(x,y);
				ctx.lineTo(x+r*Math.cos(i*2*Math.PI/denominator),y+r*Math.sin(i*2*Math.PI/denominator));
		        ctx.arc(x,y,r,i*2*Math.PI/denominator,(i+1)*2*Math.PI/denominator,false);
		        ctx.lineTo(x,y);
		        ctx.fill()
				ctx.stroke();
			}
			ctx.restore();
		
		    // Draw the empty stuff
		    ctx.fillStyle = fractionEmptyColor;
		    ctx.strokeStyle = fractionLineColor;
			ctx.lineCap = "round";
			ctx.lineWidth = 0.05*r;
		    ctx.save();	
		    var i;
			for (i=numerator; i<denominator; i++){
				ctx.beginPath();
				//ctx.rotate(2*Math.PI/fractionDemonimator);
				ctx.moveTo(x,y);
				ctx.lineTo(x+r*Math.cos(i*2*Math.PI/denominator),y+r*Math.sin(i*2*Math.PI/denominator));
		        ctx.arc(x,y,r,i*2*Math.PI/denominator,(i+1)*2*Math.PI/denominator,false);
		        ctx.lineTo(x,y);
		        ctx.fill();
				ctx.stroke();
			}
			ctx.restore();
        }else{
			if( numerator === 0 ){
			    ctx.fillStyle = fractionEmptyColor;
			}else{
			    ctx.fillStyle = fractionFillColor;
			}
		    ctx.strokeStyle = fractionLineColor;
			ctx.lineCap = "round";
			ctx.lineWidth = 0.05*r;
		    ctx.save();	
				ctx.beginPath();
				//ctx.rotate(2*Math.PI/fractionDemonimator);
				ctx.moveTo(x+r,y);
			    ctx.arc(x,y,r,0,2*Math.PI,false);
			    ctx.fill();
				ctx.stroke();
			ctx.restore();
		}
        // Draw a cirlce for good measure
        ctx.strokeStyle = fractionOutlineColor;
        ctx.beginPath();
		ctx.arc(x,y,r,0,2*Math.PI,false);
        ctx.stroke();
            
		ctx.restore();
    }

	function any(quiz){
		var availableQuestions = [];
		var whichQuestion = quiz.getOption('fractionQuestion','any');

		if( whichQuestion === 'simple' || whichQuestion === 'any' ){
			availableQuestions.push(simplePic);
		}
		if( whichQuestion === 'add1' || whichQuestion === 'any' ){
			availableQuestions.push(simpleAdd);
		}
		if( whichQuestion === 'sub1' || whichQuestion === 'any' ){
			availableQuestions.push(simpleSub);
		}
		if( whichQuestion === 'add2' || whichQuestion === 'any' ){
			availableQuestions.push(complexAdd);
		}

		var question = quiz.choose(availableQuestions,1)[0];
		question(quiz);
	}

	var options = [];
	options.push({
		name: 'fractionQuestion',
		type: 'select',
		config: {
			'Any Question':'any',
			'Identify':'simple',
			'Basic Addition':'add1',
			'Basic Subtraction':'sub1',
			'Adv. Addition':'add2'
		}
	});
	options.push({
		name: 'fractionFillColor',
		type: 'select',
		config: {
			default: '#0DF',
			white: '#FFF',
			red: '#F00',
			orange: '#F80',
			yellow: '#FF0',
			lime: '#0F0',
			green: '#080',
			aqua: '#0FF',
			blue: '#00F',
			purple: '#F0F',
			brown: '#a52a2a',
			gray: '#888',
			black: '#000'
		}
	});

	return {
		simplePic:simplePic,
		simpleAdd:simpleAdd,
		simpleSub:simpleSub,
		any: any,
		options: options
	};

})();
