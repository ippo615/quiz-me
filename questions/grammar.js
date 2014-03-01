var grammar = (function () {

	var actors = 'boy girl mother father sister daughter brother son dog cat monkey gorilla elephant bird teacher doctor nurse baby'.split(' ');
	var adjectives = 'good bad smart nice pretty soft kind silly cold happy sad sneezy grumpy sleepy bashful shy'.split(' ');
	var adverbs = 'quickly carefully eagerly quietly beautifully boldly bravely cheerfully defiantly awkwardly furiously majestically mechanically nervously tenderly'.split(' ');
	var pastActions = 'ran walked went danced jogged drove skipped hopped jumped flew swung slithered crawled slid snuck'.split(' ');
	var presentActions = 'runs walks goes dances jogs drives skips hops jumps flies swings slithers crawls slides sneaks'.split(' ');
	var places = 'house school shop store restaurant hospital office apartment park kitchen zoo garden corner library pizzeria'.split(' ');
	var placeAdjectives = 'tiny gigantic red orange yellow green blue hidden expensive shady dirty clean smelly elusive central distant'.split(' ');

	function makeChoicesPast(quiz) {
		return {
			actor: quiz.choose(actors, 1)[0],
			actorAdj: quiz.choose(adjectives, 1)[0],
			adverb: quiz.choose(adverbs, 1)[0],
			verb: quiz.choose(pastActions, 1)[0],
			place: quiz.choose(places, 1)[0],
			placeAdj: quiz.choose(placeAdjectives, 1)[0]
		};
	}

	function makeChoicesPresent(quiz) {
		return {
			actor: quiz.choose(actors, 1)[0],
			actorAdj: quiz.choose(adjectives, 1)[0],
			adverb: quiz.choose(adverbs, 1)[0],
			verb: quiz.choose(presentActions, 1)[0],
			place: quiz.choose(places, 1)[0],
			placeAdj: quiz.choose(placeAdjectives, 1)[0]
		};
	}

	function makeSentence(choices) {
		return 'The ' + choices.actorAdj + ' ' + choices.actor + ' ' + choices.adverb + ' ' + choices.verb + ' to the ' + choices.placeAdj + ' ' + choices.place + '.';
	}

	function actorPresent(quiz) {
		var choices = makeChoicesPresent(quiz);
		var question = 'In the following sentence what is a noun? "' + makeSentence(choices) + '"';
		quiz.askQuestion(quiz, question, choices.actor, [choices.actorAdj, choices.verb, choices.placeAdj, choices.adverb]);
	}

	function placePresent(quiz) {
		var choices = makeChoicesPresent(quiz);
		var question = 'In the following sentence what is a noun? "' + makeSentence(choices) + '"';
		quiz.askQuestion(quiz, question, choices.place, [choices.actorAdj, choices.verb, choices.placeAdj, choices.adverb]);
	}

	function verbPresent(quiz) {
		var choices = makeChoicesPresent(quiz);
		var question = 'In the following sentence what is a verb? "' + makeSentence(choices) + '"';
		quiz.askQuestion(quiz, question, choices.verb, [choices.actor, choices.actorAdj, choices.place, choices.placeAdj, choices.adverb]);
	}

	function adverbPresent(quiz) {
		var choices = makeChoicesPresent(quiz);
		var question = 'In the following sentence what is an adverb? "' + makeSentence(choices) + '"';
		quiz.askQuestion(quiz, question, choices.adverb, [choices.actor, choices.actorAdj, choices.place, choices.placeAdj, choices.verb]);
	}

	function actorAdjPresent(quiz) {
		var choices = makeChoicesPresent(quiz);
		var question = 'In the following sentence what is an adjective? "' + makeSentence(choices) + '"';
		quiz.askQuestion(quiz, question, choices.actorAdj, [choices.actor, choices.place, choices.adverb, choices.verb]);
	}

	function placeAdjPresent(quiz) {
		var choices = makeChoicesPresent(quiz);
		var question = 'In the following sentence what is an adjective? "' + makeSentence(choices) + '"';
		quiz.askQuestion(quiz, question, choices.placeAdj, [choices.actor, choices.place, choices.adverb, choices.verb]);
	}

	function any(quiz) {
		var question = quiz.choose([
			actorPresent,
			placePresent,
			verbPresent,
			adverbPresent,
			actorAdjPresent,
			placeAdjPresent
		], 1)[0];
		question(quiz);
	}

	return {
		questions: {
			any: any
		},
		options: {}
	};

})();
