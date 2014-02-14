var fractionQuestion = (function(){

	var saved = {
		denominator: 1,
		numerator1: 1,
		numerator2: 1,
		quiz: null
	};

	function redrawPair(){
		var d = saved.denominator;
		var n1 = saved.numerator1;
		var n2 = saved.numerator2;
		var quiz = saved.quiz;

		var r = 40;
		var padding = 10;
		var x1 = (160-r-padding)*quiz.globalScale;
		var y1 = 160*quiz.globalScale;
		var x2 = (160+r+padding)*quiz.globalScale;
		var y2 = 160*quiz.globalScale;
		drawFraction(x1,y1,r*quiz.globalScale,n1,d,quiz);
        drawFraction(x2,y2,r*quiz.globalScale,n2,d,quiz);
	}
	function redrawSingle(){
		var d = saved.denominator;
		var n1 = saved.numerator1;
		var quiz = saved.quiz;
		drawFraction(110*quiz.globalScale,100*quiz.globalScale,60*quiz.globalScale,n1,d,quiz);
	}

	function simplePic(quiz){
    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        
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
		saved.denominator = d;
		saved.numerator1 = n1;
		saved.quiz = quiz;
		quiz.onResize = redrawSingle;

		redrawSingle();
    }

	function simpleAdd(quiz){
    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        
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
		saved.denominator = d;
		saved.numerator1 = n1;
		saved.numerator2 = n2;
		saved.quiz = quiz;
		quiz.onResize = redrawPair;
		redrawPair();
    }
	function simpleSub(quiz){
    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        
        var maxDenominator = parseInt( quiz.getOption('fractionMaxDenominator','12' ), 10 );
        var minDenominator = parseInt( quiz.getOption('fractionMinDenominator','1' ), 10 );

        var d = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
        var n1 = Math.round( d*Math.random() );
        var n2 = Math.round( d*Math.random() );
		n1 = n1+n2;

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

		quiz.onResize = quiz.doNothing;
		quiz.choiceSet(1,answers[0], answer===answers[0]);
		quiz.choiceSet(2,answers[1], answer===answers[1]);
		quiz.choiceSet(3,answers[2], answer===answers[2]);
		quiz.choiceSet(4,answers[3], answer===answers[3]);
		quiz.questionNumbers( n1+'/'+d, '-'+n2+'/'+d );
		quiz.questionPrompt( 'Difference?' );

		// Save the parameters for redrawing durring a resize
		saved.denominator = d;
		saved.numerator1 = n1;
		saved.numerator2 = n2;
		saved.quiz = quiz;
		quiz.onResize = redrawPair;
		redrawPair();
    }
	function _simpleSum(quiz){
    	var canvas = quiz.genericCanvas;
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        
        var maxDenominator = parseInt( quiz.getOption('fractionMaxDenominator','12' ), 10 );
        var minDenominator = parseInt( quiz.getOption('fractionMinDenominator','1' ), 10 );
        var maxNumerator = parseInt( quiz.getOption('fractionMaxNumerator','6' ), 10 );
        var minNumerator = parseInt( quiz.getOption('fractionMinNumerator','0' ), 10 );

        var d = Math.round( minDenominator + Math.random()*(maxDenominator-minDenominator) );
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
            
            // Draw a cirlce for good measure
            ctx.strokeStyle = fractionOutlineColor;
            ctx.beginPath();
			ctx.arc(x,y,r,0,2*Math.PI,false);
            ctx.stroke();
            
		ctx.restore();
    }

	function any(quiz){
		var question = quiz.choose([
			simplePic,
			simpleAdd,
			simpleSub
		],1)[0];
		question(quiz);
	}

	return {
		simplePic:simplePic,
		simpleAdd:simpleAdd,
		simpleSub:simpleSub,
		any: any
	};

})();
