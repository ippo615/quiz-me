var math_word_problem = (function () {
	var maleNames = 'James John Robert Michael William David Richard Charles Joseph Thomas Christopher Daniel Paul Mark Donald George Kenneth Steven Edward Brian Ronald Anthony Kevin Jason Matthew Gary Timothy Jose Larry Jeffrey Frank Scott Eric Stephen Andrew Raymond Gregory Joshua Jerry Dennis Walter Patrick Peter Harold Douglas Henry Carl Arthur Ryan Roger Joe Juan Jack Albert Jonathan Justin Terry Gerald Keith Samuel Willie Ralph Lawrence Nicholas Roy Benjamin Bruce Brandon Adam Harry Fred Wayne Billy Steve Louis Jeremy Aaron Randy Howard Eugene Carlos Russell Bobby Victor Martin Ernest Phillip Todd Jesse Craig Alan Shawn Clarence Sean Philip Chris Johnny Earl Jimmy Antonio Danny Bryan Tony Luis Mike Stanley Leonard Nathan Dale Manuel Rodney Curtis Norman Allen Marvin Vincent Glenn Jeffery Travis Jeff Chad Jacob Lee Melvin Alfred Kyle Francis Bradley Jesus Herbert Frederick Ray Joel Edwin Don Eddie Ricky Troy Randall Barry Alexander Bernard Mario Leroy Francisco Marcus Micheal Theodore Clifford Miguel Oscar Jay Jim Tom Calvin Alex Jon Ronnie Bill Lloyd Tommy Leon Derek Warren Darrell Jerome Floyd Leo Alvin Tim Wesley Gordon Dean Greg Jorge Dustin Pedro Derrick Dan Lewis Zachary Corey Herman Maurice Vernon Roberto Clyde Glen Hector Shane Ricardo Sam Rick Lester Brent Ramon Charlie Tyler Gilbert Gene Marc Reginald Ruben Brett Angel Nathaniel Rafael Leslie Edgar Milton Raul Ben Chester Cecil Duane Franklin Andre Elmer Brad Gabriel Ron Mitchell Roland Arnold Harvey Jared Adrian Karl Cory Claude Erik Darryl Jamie Neil Jessie Christian Javier Fernando Clinton Ted Mathew Tyrone Darren Lonnie Lance Cody Julio Kelly Kurt Allan Nelson Guy Clayton Hugh Max Dwayne Dwight Armando Felix Jimmie Everett Jordan Ian Wallace Ken Bob Jaime Casey Alfredo Alberto Dave Ivan Johnnie Sidney Byron Julian Isaac Morris Clifton Willard Daryl Ross Virgil Andy Marshall Salvador Perry Kirk Sergio Marion Tracy Seth Kent Terrance Rene Eduardo Terrence Enrique Freddie Wade'.split(' ');
	var femaleNames = 'Mary Patricia Linda Barbara Elizabeth Jennifer Maria Susan Margaret Dorothy Lisa Nancy Karen Betty Helen Sandra Donna Carol Ruth Sharon Michelle Laura Sarah Kimberly Deborah Jessica Shirley Cynthia Angela Melissa Brenda Amy Anna Rebecca Virginia Kathleen Pamela Martha Debra Amanda Stephanie Carolyn Christine Marie Janet Catherine Frances Ann Joyce Diane Alice Julie Heather Teresa Doris Gloria Evelyn Jean Cheryl Mildred Katherine Joan Ashley Judith Rose Janice Kelly Nicole Judy Christina Kathy Theresa Beverly Denise Tammy Irene Jane Lori Rachel Marilyn Andrea Kathryn Louise Sara Anne Jacqueline Wanda Bonnie Julia Ruby Lois Tina Phyllis Norma Paula Diana Annie Lillian Emily Robin Peggy Crystal Gladys Rita Dawn Connie Florence Tracy Edna Tiffany Carmen Rosa Cindy Grace Wendy Victoria Edith Kim Sherry Sylvia Josephine Thelma Shannon Sheila Ethel Ellen Elaine Marjorie Carrie Charlotte Monica Esther Pauline Emma Juanita Anita Rhonda Hazel Amber Eva Debbie April Leslie Clara Lucille Jamie Joanne Eleanor Valerie Danielle Megan Alicia Suzanne Michele Gail Bertha Darlene Veronica Jill Erin Geraldine Lauren Cathy Joann Lorraine Lynn Sally Regina Erica Beatrice Dolores Bernice Audrey Yvonne Annette June Samantha Marion Dana Stacy Ana Renee Ida Vivian Roberta Holly Brittany Melanie Loretta Yolanda Jeanette Laurie Katie Kristen Vanessa Alma Sue Elsie Beth Jeanne Vicki Carla Tara Rosemary Eileen Terri Gertrude Lucy Tonya Ella Stacey Wilma Gina Kristin Jessie Natalie Agnes Vera Willie Charlene Bessie Delores Melinda Pearl Arlene Maureen Colleen Allison Tamara Joy Georgia Constance Lillie Claudia Jackie Marcia Tanya Nellie Minnie Marlene Heidi Glenda Lydia Viola Courtney Marian Stella Caroline Dora Jo Vickie Mattie Terry Maxine Irma Mabel Marsha Myrtle Lena Christy Deanna Patsy Hilda Gwendolyn Jennie Nora Margie Nina Cassandra Leah Penny Kay Priscilla Naomi Carole Brandy Olga Billie Dianne Tracey Leona Jenny Felicia Sonia Miriam Velma Becky Bobbie Violet Kristina Toni Misty Mae Shelly Daisy Ramona Sherri Erika Katrina Claire'.split(' ');

	var allNames = [];
	var i = 0,
		l = maleNames.length;
	for (i = 0; i < l; i += 1) {
		allNames.push(maleNames[i]);
		allNames.push(femaleNames[i]);
	}

	var commonFruits = 'cherry orange,mango,black elderberry,chestnut,grape,hazelnut,avocado,plum,red elderberry,red raspberry,crabapple,apple,apricot,banana,blackberry,blueberry,breadnut,cantaloupe,cawesh,cherry,coconut,cranberry,currant,date,dragonfruit,elderberry,fig,gooseberry,grape,grapefruit,guava,honeydew,jujube,juniper berry,kiwifruit,lemon,lime,limeberry,loganberry,lychee,macadamia,mango,miracle fruit,nectarine,orange,papaya,peach,pear,persimmon,pineapple,plum,pomegranate,pomelo,raspberry,snow berry,star apple,starfruit,strawberry,tangerine,watermelon'.split(',');

	var commonObjects = 'dollar cent apple orange banana pen pencil ball toy book eraser staple sock block lollipop'.split(' ');

	function fillInTemplate(template, object) {
		var prop, marker;
		var result = template;
		for (prop in object) {
      if( object.hasOwnProperty(prop) ){
        marker = '{{' + prop + '}}';
        result = result.replace(marker, object[prop]);
        result = result.replace(marker, object[prop]);
        result = result.replace(marker, object[prop]);
      }
		}
		return result;
	}

	function numberAndUnit(number, unit) {
		if (number === 1) {
			return number + ' ' + unit;
		} else {
			return number + ' ' + unit + 's';
		}
	}

	function makeQuestionTransfer(answerFunc, textTemplate) {
		return function (quiz) {
			var names = quiz.choose(quiz.getOption('wordProblemNameList', allNames), 2);
			var object = quiz.choose(commonObjects, 1)[0];

			var opMin = parseInt(quiz.getOption('wordProblemMin', '0'), 10);
			var opMax = parseInt(quiz.getOption('wordProblemMax', '50'), 10);
			var opRange = opMax - opMin;

			var n1 = opMin + Math.round(opRange * Math.random());
			var n2 = opMin + Math.round(opRange * Math.random());
			var nGiven = Math.round(n1 * Math.random());

			var prob = {
				name1: names[0],
				name2: names[1],
				stuff1: numberAndUnit(n1, object),
				stuff2: numberAndUnit(n2, object),
				give1: numberAndUnit(nGiven, object),
				things: object + 's'
			};

			// Generate all answers from min to max
			var i, possibleAnswers = [];
			for (i = 0; i < opMax; i += 1) {
				possibleAnswers.push(numberAndUnit(i, object));
			}

			// Get correct one and 3 more answers then shuffle all for randomness
			var answer = answerFunc(n1, n2, nGiven);
			if (answer < possibleAnswers.length) {
				possibleAnswers.splice(answer, 1);
			}
			var answers = quiz.choose(possibleAnswers, 3);
			answer = numberAndUnit(answer, object);
			answers.push(answer);
			answers = quiz.shuffle(answers);

			quiz.choiceSet(1, answers[0], answer === answers[0]);
			quiz.choiceSet(2, answers[1], answer === answers[1]);
			quiz.choiceSet(3, answers[2], answer === answers[2]);
			quiz.choiceSet(4, answers[3], answer === answers[3]);

			var text = fillInTemplate(textTemplate, prob);
			quiz.questionLongText(text);

			quiz.onResize = quiz.doNothing;
		};
	}

	function makeQuestionGroup(answerFunc, textTemplate) {
		return function (quiz) {
			var names = quiz.choose(quiz.getOption('wordProblemNameList', allNames), 2);
			var object = quiz.choose(commonObjects, 1)[0];

			var opMin = parseInt(quiz.getOption('wordProblemMin', '0'), 10);
			var opMax = parseInt(quiz.getOption('wordProblemMax', '50'), 10);
			var opRange = opMax - opMin;

			var n1 = opMin + Math.round(opRange * Math.random());
			var n2 = opMin + Math.round(opRange * Math.random());
			var nGiven = Math.round(n1 * Math.random());

			var prob = {
				name1: names[0],
				name2: names[1],
				stuff1: numberAndUnit(n1, object),
				stuff2: numberAndUnit(n2, object),
				give1: numberAndUnit(nGiven, object),
				things: object + 's'
			};

			// Generate all answers from min to max
			var i, possibleAnswers = [];
			for (i = 0; i < opMax; i += 1) {
				possibleAnswers.push(numberAndUnit(i, object));
			}

			// Get correct one and 3 more answers then shuffle all for randomness
			var answer = answerFunc(n1, n2, nGiven);
			if (answer < possibleAnswers.length) {
				possibleAnswers.splice(answer, 1);
			}
			var answers = quiz.choose(possibleAnswers, 3);
			answer = numberAndUnit(answer, object);
			answers.push(answer);
			answers = quiz.shuffle(answers);

			quiz.choiceSet(1, answers[0], answer === answers[0]);
			quiz.choiceSet(2, answers[1], answer === answers[1]);
			quiz.choiceSet(3, answers[2], answer === answers[2]);
			quiz.choiceSet(4, answers[3], answer === answers[3]);

			var text = fillInTemplate(textTemplate, prob);
			quiz.questionLongText(text);

			quiz.onResize = quiz.doNothing;
		};
	}

	var add = makeQuestionTransfer(
		function (n1, n2, nGiven) {
			return n2 + nGiven;
		},
		'{{name1}} has {{stuff1}}. {{name2}} has {{stuff2}}. {{name1}} gives {{give1}} to {{name2}}. How many {{things}} does {{name2}} have?'
	);
	var sub = makeQuestionTransfer(
		function (n1, n2, nGiven) {
			return n1 - nGiven;
		},
		'{{name1}} has {{stuff1}}. {{name2}} has {{stuff2}}. {{name1}} gives {{give1}} to {{name2}}. How many {{things}} does {{name1}} have?'
	);
	var same1 = makeQuestionTransfer(
		function (n1, n2, nGiven) {
			return nGiven;
		},
		'{{name1}} has {{stuff1}}. {{name2}} has {{stuff2}}. {{name1}} gives {{give1}} to {{name2}}. How many {{things}} did {{name1}} give away?'
	);
	var same2 = makeQuestionTransfer(
		function (n1, n2, nGiven) {
			return nGiven;
		},
		'{{name1}} has {{stuff1}}. {{name2}} has {{stuff2}}. {{name1}} gives {{give1}} to {{name2}}. How many {{things}} did {{name2}} recieve?'
	);
	var same = function (quiz) {
		var question = quiz.choose([
			same1,
			same2
		], 1)[0];
		question(quiz);
	};


	function any(quiz) {
		var question = quiz.choose([
			add,
			sub,
			same
		], 1)[0];
		question(quiz);
	}

	return {
		questions: {
			any: any,
			add: add,
			sub: sub,
			same: same
		},
		options: {}
	};

})();
