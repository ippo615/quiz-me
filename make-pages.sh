#!/bin/bash

function make_index {
	echo "<!DOCTYPE html>
<html>
  <head>
  <meta charset=\"UTF-8\">

  <title>Quiz Me</title>

  <meta name=\"description\" content=\"Quiz Me\">
  <meta name=\"author\" content=\"Andrew Ippoliti\">

  <meta name=\"HandheldFriendly\" content=\"True\">
  <meta name=\"MobileOptimized\" content=\"320\">
  <meta name=\"viewport\" content=\"width=320, height=320, user-scalable=no\" />
  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />	

<style type=\"text/css\">
.animated {
  -moz-transition:all 300ms;
  -webkit-transition:all 300ms;
  -ms-transition:all 300ms;
  -o-transition:all 300ms;
  transition:all 300ms;
}
.app-link {
	text-align: center;
    width: 5em; height: 5em;
    text-decoration: none;
    color: #000;
    border: 4px solid #FFF;
    margin: 0.45em;
	overflow: hidden;
    border-radius: 4px;
    position: relative;
	/*display: block;
    float: left;*/
	display: inline-block;
}
.app-title {
	background-color: rgba(255,255,255,0.7);
    font-size: 1em;
    font-weight: bold;
    position: relative;
    display:block;
}
.app-description {
	background-color: rgba(255,255,255,0.7);
    font-size: 0.5em;
    line-height: 1;
    position: relative;
}
.app-link:hover .app-description {
	transform: translate(0,0);
    -ms-transform: translate(0,0);
    -webkit-transform: translate(0,0);
}
.app-link .app-description {
	transform: translate(-100%,0);
    -ms-transform: translate(-100%,0);
    -webkit-transform: translate(-100%,0);
}
.app-icon {
    /*color: rgba(0,0,128,1);
    text-shadow: -1px -1px 0px #AAA, 1px 1px 0px #444 ;
    background: url(icons.png);
    width: 64px;
    height: 64px;
    overflow: hidden;*/
    /*
	opacity: 0.8;
    width: 0em;
    height: 1em;
    display:block;
    position: absolute;
    bottom: 0px;
    text-align:center;
    left: 0em;
    font-size:7em;
    font-weight: bold;
    */
    font-size: 2em;
}
.rainbow a:nth-of-type(7n+1) {background: #008;}
.rainbow a:nth-of-type(7n+2) {background: #080;}
.rainbow a:nth-of-type(7n+3) {background: #800;}
.rainbow a:nth-of-type(7n+4) {background: #880;}
.rainbow a:nth-of-type(7n+5) {background: #808;}
.rainbow a:nth-of-type(7n+6) {background: #088;}
.rainbow a:nth-of-type(7n+7) {background: #840;}
.clearfix:before,
.clearfix:after {
    content: \" \";
    display: table;
}

.clearfix:after {
    clear: both;
}

.clearfix {
    *zoom: 1;
}
#global-container {
	background: #000;
	text-align:center;
}

/* Bright color scheme */
.app-link {
    color: #000;
    border: 4px solid #000;
}
.app-title, .app-description{
	background-color: rgba(255,255,255,0.7);
}
.rainbow a:nth-of-type(7n+1) {background: #00F;}
.rainbow a:nth-of-type(7n+2) {background: #0F0;}
.rainbow a:nth-of-type(7n+3) {background: #F00;}
.rainbow a:nth-of-type(7n+4) {background: #FF0;}
.rainbow a:nth-of-type(7n+5) {background: #F0F;}
.rainbow a:nth-of-type(7n+6) {background: #0FF;}
.rainbow a:nth-of-type(7n+7) {background: #F80;}
#global-container {
	background: #FFF;
	text-align:center;
}
</style>

  </head>
  <body id=\"global-container\" class=\"no-select rainbow clearfix\">"

for each in $1; do
	filename=$(basename --suffix='.js' "$each")
	jsObject=$(echo "$filename" | sed -e 's/-/_/g')
	htmlTitle=$(echo "$filename" | sed -e 's/-/ /g')

	echo "<a class=\"app-link\" href=\"quiz/$filename.html\">
		<div class=\"app-title\">$htmlTitle</div>
		<div class=\"app-description animated\">...</div>
        <div class=\"app-icon\" id=\"$filename-icon\"></div>
	</a>"
done;

echo "    <script type=\"text/javascript\">
function findScale(xSize, ySize, xGoal, yGoal) {
    // We'll either to match \`xSize\` to \`xGoal\` or \`ySize\` to \`yGoal\` so
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
function resize(){
    var globalWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var globalHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	var scale = findScale( globalWidth, globalHeight, 320, 320 );
    var fontSize = 12 / scale;
    document.getElementById('global-container').style.fontSize = fontSize + 'px';
}
window.onresize = resize;
onload = function(){
	resize();
};
    </script>
  </body>
</html>"
}

function make_page {
	title="$1"
	description="$2"
	jsSrcUrl="$3"
	objName="$4"
	
	echo "<!DOCTYPE html>
<html>
  <head>
  <meta charset=\"UTF-8\">

  <title>$title</title>

  <meta name=\"description\" content=\"$description\">
  <meta name=\"author\" content=\"Andrew Ippoliti\">

  <meta name=\"HandheldFriendly\" content=\"True\">
  <meta name=\"MobileOptimized\" content=\"320\">
  <meta name=\"viewport\" content=\"width=320, height=320, user-scalable=no\" />
  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />	

  <style type=\"text/css\"></style>
	<link rel=\"stylesheet\" href=\"../style.css\" />
	<!--[if IE]>
		<script type=\"text/javascript\" src=\"../vendor/excanvas.js\"></script>
	<![endif]-->
	<script type=\"text/javascript\" src=\"../quiz.js\"></script>
	<script type=\"text/javascript\" src=\"../$jsSrcUrl\"></script>
  </head>
  <body id=\"global-container\" class=\"no-select\">

    <script type=\"text/javascript\">

onload = function(){
	var myQuiz = new Quiz({
		makeQuestion: $objName.questions.any,
		options: {}
	});
	myQuiz.createUi(document.getElementById('global-container'));
	myQuiz.setupUi();
	myQuiz.setupOptionsForm($objName.options);
	window.onresize = function(){
		myQuiz.resize()	;
	};

	// Timeout fixes IE explorer canvas bug and andoid bug
	setTimeout( function(){
		myQuiz.resize();
		myQuiz.newQuestion();
	}, 50 );

};

    </script>

  </body>
</html>"
}

function make_page_simple {
	filename=$(basename --suffix='.js' "$1")
	jsObject=$(echo "$filename" | sed -e 's/-/_/g')
	htmlTitle=$(echo "$filename" | sed -e 's/-/ /g')

	make_page "$htmlTitle" "$htmlTitle quiz" "questions/$filename.js" "$jsObject" > "quiz/$filename.html"
}

rm -r quiz
mkdir quiz

questionFiles=$(ls questions/*js -als | awk '{ print $10 }')

for each in $questionFiles; do
	make_page_simple "$each"
done;

make_index "$questionFiles" > 'index.html'

#make_page_simple 'basic-math.js'
#make_page_simple 'clock.js'
#make_page_simple 'fraction.js'
#make_page_simple 'grammar.js'
#make_page_simple 'graph.js'
#make_page_simple 'linux.js'
#make_page_simple 'math-word-problem.js'
#make_page_simple 'perimeter.js'
#make_page_simple 'periodic-table.js'
#make_page_simple 'polynomial.js'
#make_page_simple 'us-president.js'

# make_page 'Basic Math' 'A fraction practice quiz' 'questions/fractions.js' 'fractionQuestion' > 'quiz/fractions.html'
# make_page 'Math' 'A math practice quiz' 'questions/math.js' 'mathQuestion' > 'quiz/math.html'

