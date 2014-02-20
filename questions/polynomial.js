var polynomialQuestion = (function(){

	var polynomial = [];

	function polyEval(poly,x){
		var i = poly.length;
		var val = 0;
		while( i-- ){
			val += poly[i]*Math.pow(x,i);
		}
		return val;
	}
	function polyDiff(poly){
		var i, l = poly.length;
		var newPoly = [];
		for( i=1; i<l; i+=1 ){
			newPoly.push( poly[i]*i );
		}
		return newPoly;
	}
	function polyAddScale(aPoly,bPoly,scale){
		var a, al = aPoly.length;
		var b, bl = bPoly.length;
		var newPoly = [];
		if( al < bl ){
			for( a=0; a<al; a+=1 ){
				newPoly.push(aPoly[a]+bPoly[a]*scale);
			}
			for( b=bl; b<bl; b+=1 ){
				newPoly.push(bPoly[b]*scale);
			}
		}else{
			for( b=0; b<bl; b+=1 ){
				newPoly.push(aPoly[b]+bPoly[b]*scale);
			}
			for( a=al; a<al; a+=1 ){
				newPoly.push(aPoly[a]);
			}
		}
		return newPoly;
	}
	function polyAdd(aPoly,bPoly){
		return polyAddScale(aPoly,bPoly,1);
	}
	function polySub(aPoly,bPoly){
		return polyAddScale(aPoly,bPoly,-1);
	}
	function polyMul(aPoly,bPoly){
		var a, al = aPoly.length;
		var b, bl = bPoly.length;
		var newPoly = [];
		var n, nl = al + bl;
		for( n=0; n<nl; n+=1 ){
			newPoly.push(0);
		}
		for( a=0; a<al; a+=1 ){
			for( b=0; b<bl; b+=1 ){
				newPoly[a+b] += aPoly[a]*bPoly[b];
			}
		}
		return newPoly;
	}
	function polyDiv(aPoly,bPoly){
		var a, al = aPoly.length;
		var b, bl = bPoly.length;
		var newPoly = [];
		var n, nl = al + bl;
		for( n=0; n<nl; n+=1 ){
			newPoly.push(0);
		}
		for( a=0; a<al; a+=1 ){
			for( b=0; b<bl; b+=1 ){
				newPoly[a+b] += aPoly[a]/bPoly[b];
			}
		}
		return newPoly;
	}
	function polyOrder(poly){
		var order = 0;
		var i, l = poly.length;
		for( i=0; i<l; i+=1 ){
			if( poly[i] !== 0 ){
				order = i;
			}
		}
		return order;
	}
	function polyToEquation(poly,symbol){
		var str = '';
		var i, l=poly.length;
		var isAllZero = true;
		for( i=0; i<l; i+=1 ){ 
			if( poly[i] !== 0 ){
				isAllZero = false;
			}
		}
		if( isAllZero ){ return '0'; }
		var symbols = [];
		if( l >= 1 && poly[0] !== 0 ){ symbols.push( poly[0] ); }
		if( l >= 2 && poly[1] !== 0 ){ symbols.push( poly[1]+symbol ); }
		for( i=2; i<l; i+=1 ){
			if( poly[i] !== 0 ){
				if( poly[i] > 0 ){
					if( poly === 1 ){
						symbols.push( symbol+'<sup>'+i+'</sup>' );
					}else{
						symbols.push( poly[i]+symbol+'<sup>'+i+'</sup>' );
					}
				}else{
					symbols.push( poly[i]+symbol+'<sup>'+i+'</sup>' );
				}
			}
		}
		str = symbols.join('+');
		str = str.replace(/\+-/g,'-');
		return str;
	}

	var saved;
	function askPoly(poly,choices,quiz){
		saved.poly = poly;
		saved.quiz = quiz;
		var answer = 'y='+polyToEquation(poly,'x');
		quiz.askQuestion(quiz,'',answer,choices);
		quiz.onResize = redraw;
	}

	function randomPolynomial(order,quiz){
		var valMin = parseFloat( quiz.getOption('polynomialCoefficientMin','-5.0') );
		var valMax = parseFloat( quiz.getOption('polynomialCoefficientMax','5.0') );
		var valRange = valMax - valMin;
		var poly = [];
		var i;
		for( i=0; i<=order; i+=1 ){
			poly.push( Math.round(valMin + valRange*Math.random()) );
		}
		return poly;
	}
	function mulQuestion(quiz){
		var orderMin = parseInt( quiz.getOption('polynomialOrderMin','1'), 10 );
		var orderMax = parseInt( quiz.getOption('polynomialOrderMax','2'), 10 );
		var polySymbol = quiz.getOption('polynomialSymbol','x');
		var order = Math.round( orderMin + Math.random()*(orderMax-orderMin) );

		var p1 = randomPolynomial(order,quiz);
		var p2 = randomPolynomial(order,quiz);
		var polyProd = polyMul(p1,p2);
		var choiceOrder = polyOrder(polyProd);
		var answer = polyToEquation( polyProd, polySymbol );
		var choices = [
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol )
		];
		quiz.askQuestion(quiz,'Multiply '+polyToEquation(p1,polySymbol)+' with '+polyToEquation(p2,polySymbol),answer,choices);
	}
	function addQuestion(quiz){
		var orderMin = parseInt( quiz.getOption('polynomialOrderMin','1'), 10 );
		var orderMax = parseInt( quiz.getOption('polynomialOrderMax','2'), 10 );
		var polySymbol = quiz.getOption('polynomialSymbol','x');
		var order = Math.round( orderMin + Math.random()*(orderMax-orderMin) );

		var p1 = randomPolynomial(order,quiz);
		var p2 = randomPolynomial(order,quiz);
		var polySum = polyAdd(p1,p2);
		var choiceOrder = polyOrder(polySum);
		var answer = polyToEquation( polySum, polySymbol );
		var choices = [
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol )
		];
		quiz.askQuestion(quiz,'Add '+polyToEquation(p1,polySymbol)+' and '+polyToEquation(p2,polySymbol),answer,choices);
	}
	function subQuestion(quiz){
		var orderMin = parseInt( quiz.getOption('polynomialOrderMin','1'), 10 );
		var orderMax = parseInt( quiz.getOption('polynomialOrderMax','2'), 10 );
		var polySymbol = quiz.getOption('polynomialSymbol','x');
		var order = Math.round( orderMin + Math.random()*(orderMax-orderMin) );

		var p1 = randomPolynomial(order,quiz);
		var p2 = randomPolynomial(order,quiz);
		var polyDifference = polySub(p1,p2);
		var choiceOrder = polyOrder(polyDifference);
		var answer = polyToEquation( polyDifference, polySymbol );
		var choices = [
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol ),
			polyToEquation( randomPolynomial(choiceOrder,quiz), polySymbol )
		];
		quiz.askQuestion(quiz,'Subtract '+polyToEquation(p2,polySymbol)+' from '+polyToEquation(p1,polySymbol),answer,choices);
	}
	function factorQuestion(quiz){
		var orderMin = parseInt( quiz.getOption('polynomialOrderMin','1'), 10 );
		var orderMax = parseInt( quiz.getOption('polynomialOrderMax','2'), 10 );
		var polySymbol = quiz.getOption('polynomialSymbol','x');
		var order = Math.round( orderMin + Math.random()*(orderMax-orderMin) );

		var p1 = randomPolynomial(order,quiz);
		var p2 = randomPolynomial(order,quiz);
		var polyProd = polyMul(p1,p2);

		var answer = '('+polyToEquation( p1, polySymbol )+')('+polyToEquation( p2, polySymbol )+')';
		var choices = [
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')',
			'('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')('+polyToEquation( randomPolynomial(order,quiz), polySymbol )+')'
		];
		quiz.askQuestion(quiz,'Factor: '+polyToEquation(polyProd,polySymbol),answer,choices);
	}

	function any(quiz){
		var question = quiz.choose([
			addQuestion,
			subQuestion,
			mulQuestion,
			factorQuestion
		],1)[0];
		question(quiz);
	}

	return {
		any: any,
		add: addQuestion,
		sub: subQuestion,
		mul: mulQuestion,
		factor: factorQuestion
	};
})();
