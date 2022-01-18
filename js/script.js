//Create canvas
let canvas = document.getElementById('canvas');
//let ctx = canvas.getContext('2d');
const scaleFactor = 1;

const dartBoard = {};

//Dartboard, one section dimension
dartBoard.secWidth = 2*Math.PI/20;

//Section starting position from rightmost edge of section 20, arbitrary could be anything else
dartBoard.secStarting = Math.PI/2 - dartBoard.secWidth/2;

//Dartboard sections starting point in radian, starting from the rightmost edge
dartBoard.sections = {
	20 : dartBoard.secStarting,
	5 : dartBoard.secStarting + dartBoard.secWidth,
	12 : dartBoard.secStarting + 2*dartBoard.secWidth,
	9 : dartBoard.secStarting + 3*dartBoard.secWidth,
	14 : dartBoard.secStarting + 4*dartBoard.secWidth,
	11 : dartBoard.secStarting + 5*dartBoard.secWidth,
	8 : dartBoard.secStarting + 6*dartBoard.secWidth,
	16 : dartBoard.secStarting + 7*dartBoard.secWidth,
	7 : dartBoard.secStarting + 8*dartBoard.secWidth,
	19 : dartBoard.secStarting + 9*dartBoard.secWidth,
	3 : dartBoard.secStarting + 10*dartBoard.secWidth,
	17 : dartBoard.secStarting + 11*dartBoard.secWidth,
	2 : dartBoard.secStarting + 12*dartBoard.secWidth,
	15 : dartBoard.secStarting + 13*dartBoard.secWidth,
	10 : dartBoard.secStarting + 14*dartBoard.secWidth,
	6 : dartBoard.secStarting + 15*dartBoard.secWidth,
	13 : dartBoard.secStarting - 4*dartBoard.secWidth,
	4 : dartBoard.secStarting - 3*dartBoard.secWidth,
	18 : dartBoard.secStarting - 2*dartBoard.secWidth,
	1 : dartBoard.secStarting - dartBoard.secWidth
}

dartBoard.heightPx = 360;

//Dartboard physical dimensions
dartBoard.ringWidthDT = 8;
dartBoard.bullInside = 12.7;
dartBoard.outerBullInside = 31.8;
dartBoard.bullToTrebleInside = 107;
dartBoard.bullToDoubleOutside =  170;
dartBoard.doubleOutsideToDoubleOutside = 340;
dartBoard.diameter = 451;

//Dartboard physical dimensions mapped to the canvas
dartBoard.sizeFactor = dartBoard.diameter / dartBoard.heightPx;
dartBoard.ringWidthDTPx = dartBoard.ringWidthDT / dartBoard.sizeFactor;
dartBoard.bullInsidePx = dartBoard.bullInside / dartBoard.sizeFactor;
dartBoard.outerBullInsidePx = dartBoard.outerBullInside / dartBoard.sizeFactor;
dartBoard.bullToTrebleInsidePx = dartBoard.bullToTrebleInside / dartBoard.sizeFactor;
dartBoard.bullToDoubleOutsidePx = dartBoard.bullToDoubleOutside / dartBoard.sizeFactor;
dartBoard.doubleOutsideToDoubleOutsidePx = dartBoard.doubleOutsideToDoubleOutside / dartBoard.sizeFactor;
dartBoard.diameterPX = dartBoard.diameter / dartBoard.sizeFactor;
dartBoard.wireWidthPx = 0.5; 

//Dartboard canvas dimensions accumulated from the center point identify which sections has been hit
dartBoard.L = {};
dartBoard.L.bullsEye = dartBoard.bullInsidePx/2;
dartBoard.L.bullsEyeWire = dartBoard.L.bullsEye + dartBoard.wireWidthPx;
dartBoard.L.bulls = dartBoard.outerBullInsidePx/2;
dartBoard.L.bullsWire = dartBoard.L.bulls + dartBoard.wireWidthPx;
dartBoard.L.singleInside = dartBoard.bullToTrebleInsidePx - dartBoard.wireWidthPx - dartBoard.ringWidthDTPx;
dartBoard.L.singleInsideWire = dartBoard.L.singleInside + dartBoard.wireWidthPx;
dartBoard.L.treble = dartBoard.bullToTrebleInsidePx;
dartBoard.L.trebleWire = dartBoard.bullToTrebleInsidePx + dartBoard.wireWidthPx;
dartBoard.L.singleOuter = dartBoard.bullToDoubleOutsidePx - 2*dartBoard.wireWidthPx - dartBoard.ringWidthDTPx;
dartBoard.L.singleOuterWire = dartBoard.L.singleOuter + dartBoard.wireWidthPx;
dartBoard.L.double = dartBoard.L.singleOuterWire + dartBoard.ringWidthDTPx;
dartBoard.L.doubleWire = dartBoard.L.double + dartBoard.wireWidthPx;
dartBoard.L.out = dartBoard.diameterPX;

class Game{
	constructor(selectedGame,startingPlayer,nextPlayer){
		this.selectedGame = selectedGame;
		this.currentWinningCondition = '';
		this.starting = startingPlayer;
		this.currentLeg = 0;
		this.currentRound = 0;
		this.sameRound = true;
		this.currentPlayer = this.starting;
		this.nextPlayer = nextPlayer;
		this.gameLength = [
			{
				'name' : 'Best of 5',
				'code' : 'Bo5',
				'win' : 3
			},
			{
				'name' : 'Best of 7',
				'code' : 'Bo7',
				'win' : 4
			},
			{
				'name' : 'Best of 9',
				'code' : 'Bo9',
				'win' : 5
			},
			{
				'name' : 'Best of 11',
				'code' : 'Bo11',
				'win' : 6
			},
		];
		this.games = [
			{
				'name' : '301',
				'score' : 301,
				'stepInCondition' : '', 
				'winningCondition' : 'firstTo0',
				'active' : true
			},
			{
				'name' : '301 double out',
				'score' : 301,
				'stepInCondition' : '', 
				'winningCondition' : 'firstTo0DoubleOut',
				'active' : true
			},
			{
				'name' : '301 double in, double out',
				'score' : 301,
				'stepInCondition' : 'doubleIn', 
				'winningCondition' : 'firstTo0DoubleOut',
				'active' : false
			},
			{
				'name' : '501',
				'score' : 501,
				'stepInCondition' : '', 
				'winningCondition' : 'firstTo0',
				'active' : true
			},
			{
				'name' : '501 double out',
				'score' : 501,
				'stepInCondition' : '', 
				'winningCondition' : 'firstTo0DoubleOut',
				'active' : true
			},
			{
				'name' : '501 double in, double out',
				'score' : 501,
				'stepInCondition' : 'doubleIn', 
				'winningCondition' : 'firstTo0DoubleOut',
				'active' : false
			},{
				'name' : '1001',
				'score' : 1001,
				'stepInCondition' : '', 
				'winningCondition' : 'firstTo0',
				'active' : true
			},
			{
				'name' : '1001 double out',
				'score' : 1001,
				'stepInCondition' : '', 
				'winningCondition' : 'firstTo0DoubleOut',
				'active' : true
			},
			{
				'name' : '1001 double in, double out',
				'score' : 1001,
				'stepInCondition' : 'doubleIn', 
				'winningCondition' : 'firstTo0DoubleOut',
				'active' : false
			}
		]
	}

	updateCurrentPlayer(){
		this.currentPlayer.resetCurrentDart();
		let temp = this.currentPlayer;
		this.currentPlayer = this.nextPlayer;
		this.nextPlayer = temp;
		console.log('swapped players');
		this.updateRound();
	}

	//increase round only if both players thrown
	updateRound(){
		if(!this.sameRound){
			this.currentRound++;
		}
		this.sameRound = !this.sameRound;
	}

	updateLeg(){
		this.currentLeg++;
	}

	//Fetch the winning condition for the actual game
	setWinningCondition(){
		for(let i = 0;i < this.games.length; i++){
			if(this.games[i].name.toString() === this.selectedGame.toString()){
				this.currentWinningCondition = this.games[i].winningCondition;
				console.log('winning condition found and set');
			}
		}
	}

	checkWinningCondition(){
		if(this.currentWinningCondition == 'firstTo0'){
			if(Number(this.currentPlayer.currentScore) === 0){
				return true
			}

		}
		
		if(this.currentWinningCondition == 'firstTo0DoubleOut'){
			let throws = this.currentPlayer.scores.length;
			throws = throws > 0 ? --throws : throws;
			if(Number(this.currentPlayer.currentScore) === 0 && this.currentPlayer.scores[throws].std.toString() === 'double'){
				return true
			}
		}
		return false;
	}

	newLeg(){
		this.currentLeg++;
		console.log('Newleg started');
		//swap the starting players
		if(this.startingPlayer === this.currentPlayer){
			this.startingPlayer =  this.nextPlayer;
			this.nextPlayer = this.currentPlayer;
		}
		else{
			this.startingPlayer = this.currentPlayer;
		}
	}
}

class Player{
	constructor(name){
		this.name = name;
		this.scores = [];
		this.currentDart = 0;
		this.dart = 0;
		this.currentScore = 0;
		this.legsWon = 0;
	}

	//statistics
	statistics = {
		'score per dart' : 0,
		'score per 3 darts' : 0,
		'highest checkout' : 0,
		'ton+ checkouts' : 0,
		'180s' : 0,
		'140s': 0,
		'100+' : 0
	}

	updateScores(section){
		//update scores
		this.scores.push(section);
	}

	flushCurrentScores(){
		this.scores = [];
	}

	updateCurrentDart(){
		this.currentDart++;
	}

	updateDart(){
		this.dart++;
	}

	resetCurrentDart(){
		this.currentDart = 0;
	}

	//initializes starting score for player
	setCurrentScore(selectedGame,games){
		for(let i = 0; i<games.length; i++){
			if(games[i].name.toString() === selectedGame.toString()){
				this.currentScore = games[i].score;
				this.currentScore = games[i].score;
			}
		}
	}

	//updates current score of player
	updateCurrentScore(scores){
		//If score is not busted
		if(!scores.busted){
			this.currentScore -= Number(scores.score);
		}
		
		//if latest score is busted some of the last throws may need to be nullified.
		if(scores.busted){
			for(let i = this.scores.length-1; i >= 0;--i){
				if(this.scores[i].round == game.currentRound && this.scores[i].leg == game.currentLeg){
					console.log('need to remove: ');
					console.log(this.scores[i]);
					if(!this.scores[i].busted){
						this.currentScore += Number(this.scores[i].score);
					}
				}
				else{
					break;
				}
			}
		}
	}

	checkValidHit(score){
		let resultToBe = this.currentScore - score.score;
		if(resultToBe >= 0){
			return true
		}
		return false
	}

	legWin(){
		this.legsWon++;
	}
	updateStatistics(){}
}

	let player1 = new Player('Tamás');
	let computer = new Player('Computer');
	let game = new Game(501,player1,computer);

//Initialize the game
function init(){
	player1.setCurrentScore('501',game.games);
	computer.setCurrentScore('501',game.games);

	game.setWinningCondition();
	//game.setCurrentScore();
    canvas.addEventListener('mousedown',throwDart, false);
    //DartBoard.init();
    return canvas;
}

//Get the coordinates of the dart relative to center point of canvas
function throwDart(event){
    
    let coords = getPosition(event);
    let x = coords[0];
    let y = coords[1];
	
	convertCoordToLD(x,y)
	/*degree = degree * 180/Math.PI;*/
    //console.log('x: ' + x + ' y: ' + y);
}

//Convert coordinates to relative distance (length) and degree to center point
function convertCoordToLD(x,y){
	let correction = 0;
	correction = x <= 0 ? Math.PI : 0;
	if(x > 0 && y < 0){
		correction = 2 * Math.PI;
	}
	let l = Math.sqrt(x*x + y*y);
	let degree = Math.atan((0-y)/(0-x));
	degree += correction;

	getSection(l,degree);
}

//Get the section clicked on
function getSection(l,degree){

	let max = 0;
	let section = {
		section : 0,
		std : '',
		factor : 0,
		score : 0
	};
	//Correction for section #6
	if (degree < dartBoard.sections[13]){
		degree += 2*Math.PI;
	}

	//Identifies section
	for (key in dartBoard.L){
		if(l < dartBoard.L[key]){
			section.std = key;
			section.factor = key === 'treble' ? 3 : key === 'double' ? 2 : 1;
			break;
		}
	}

	if(section.std === 'bullsEye'){
		section.section = 50;
	}

	if(section.std === 'bulls'){
		section.section = 25;
	}

	if(section.std === 'out'){
		section.section = 0;
	}

	if(section.std !== 'bullsEye' && section.std !== 'bulls' && 	section.std !== 'out'){
		for(i in dartBoard.sections){
			if(degree >= dartBoard.sections[i]){
				if(dartBoard.sections[i]>max){
					max = dartBoard.sections[i];
					section.section = i;
				}
			}
		}
	}

	if(bounceOut(section)){
		section.score = 0;
	}
	if(!bounceOut(section)){
		section.score = section.section * section.factor;
	}

	//console.log('hit: ' + JSON.stringify(section));
	gamePlay(section);
}

//update gameplay
function gamePlay(section){
	section['leg'] = game.currentLeg;
	section['round'] = game.currentRound;
	section['dart'] = game.currentPlayer.dart;
	
	//check if the hit is valid and score does not go below 0 need to add double out option
	let validHit = game.currentPlayer.checkValidHit(section);

	if(!validHit){
		section['busted'] = true;
	}

	if(validHit){
		section['busted'] = false;
	}

		game.currentPlayer.updateScores(section);//update current score of player
		game.currentPlayer.updateCurrentDart();//increase dart thrown by 1 for current player, reset every round
		game.currentPlayer.updateDart();//increase dart thrown by 1 for current player, reset every leg
		
		game.currentPlayer.updateCurrentScore(section);
		console.log('Leg: ' + game.currentLeg + ', Round: ' + game.currentRound + ' Score: ' + game.currentPlayer.currentScore +' Throw: ' + game.currentPlayer.currentDart + ' name: ' + game.currentPlayer.name + ' dart: ' + game.currentPlayer.dart);
		let playerWon = game.checkWinningCondition();//check if player won

		if(playerWon){
			console.log('Win! Should start anext game if not yet won');
			game.currentPlayer.legWin();
			game.newLeg();
		}

		//Push player's scores to game scores
		else if(game.currentPlayer.currentDart === 3 || section.busted){
			game.updateCurrentPlayer();
		}
	}


//Check if dart bounced out or not true means bounced out, false means valid hit
function bounceOut(section){

	if(section.std.indexOf('Wire') > -1){
		return true
	}

	return false;
}

//Helper to get the relative position of the darts
function getPosition(event){
    let x = new Number();
	let y = new Number();
	
	//let canvas = document.getElementById('canvas');
	
	//Get the x and y relative to the canvas
	//Deal with weird behavior when you scroll the page
	x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	
	console.log(document.body.scrollLeft);
	
	//Get default canvas location 
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	//Translate the coordinate system
	x = translateX(x);
	y = translateY(y);
	
	var coords = [x,y];
	
	return coords;
}

function translateX(x) {
	var canvas = document.getElementById('canvas');
	x -= Math.floor(canvas.width/2);
	x *= scaleFactor;
	return x;
}

//Translate the y coordinates to cartesian centered
function translateY(y) {
	var canvas = document.getElementById('canvas');
	y -= Math.floor(canvas.height/2);
	y *= -1
	y *= scaleFactor;
	return y;
}


//Drawing

init();