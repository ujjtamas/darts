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

//Available game options used in Game object and as select options for player
const availableGames =[
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
	/*{
		'name' : '301 double in, double out',
		'score' : 301,
		'stepInCondition' : 'doubleIn', 
		'winningCondition' : 'firstTo0DoubleOut',
		'active' : false
	},*/
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
	/*{
		'name' : '501 double in, double out',
		'score' : 501,
		'stepInCondition' : 'doubleIn', 
		'winningCondition' : 'firstTo0DoubleOut',
		'active' : false
	},*/
	{
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
	}
	/*{
		'name' : '1001 double in, double out',
		'score' : 1001,
		'stepInCondition' : 'doubleIn', 
		'winningCondition' : 'firstTo0DoubleOut',
		'active' : false
	}*/
];

//Available game length options used in Game object and as select options for player
const availableGameLength = [
	{
		'name' : 'Best of 3',
		'code' : 'Bo3',
		'win' : 2
	},
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

const availableGameDifficulty =[
	{
		'name' : 'hard',
		'id' : 'h',
		'factor' : 0.5
	},
	{
		'name' : 'medium',
		'id' : 'm',
		'factor' : 1
	},
	{
		'name' : 'easy',
		'id' : 'e',
		'factor' : 2
	},
];

//Initialized framesize for difficulty, the bigger the number the easier the game, finetune with availableGameDifficulty
const frameSizeForComputer = 15;

//Initialized framesize for difficulty, the bigger the number the more difficult the game, finetune with availableGameDifficulty
const frameSizeForPlayer = 5;

//Center points for computer throws, always have it decremental order by score field
const centerPoints = [
	{
		'score' : 80,
		'xSO' : 0,
		'ySO' : 85,
		'xDO' : 0,
		'yDO' : 85
	},
	{
		'score' : 60,
		'xSO' : 0,
		'ySO' : 108,
		'xDO' : 0,
		'yDO' : 108
	},
	{
		'score' : 40,
		'xSO' : 0,
		'ySO' : 108,
		'xDO' : 0,
		'yDO' : 135
	},
	{
		'score' : 30,
		'xSO' : 0,
		'ySO' : 108,
		'xDO' : 107,
		'yDO' : -76
	},
	{
		'score' : 20,
		'xSO' : 0,
		'ySO' : 108,
		'xDO' : 127,
		'yDO' : -38
	},
	{
		'score' : 10,
		'xSO' : 107,
		'ySO' : -36,
		'xDO' : -41,
		'yDO' : 128
	},
	{
		'score' : 9,
		'xSO' : -91,
		'ySO' :  66,
		'xDO' : 36,
		'yDO' : 108
	},
	{
		'score' : 8,
		'xSO' : -97,
		'ySO' : -32,
		'xDO' : 108,
		'yDO' : 80
	},
	{
		'score' : 7,
		'xSO' : -60,
		'ySO' : -87,
		'xDO' : 1,
		'yDO' : -106
	},
	{
		'score' : 6,
		'xSO' : 110,	
		'ySO' : 1,
		'xDO' : -1,
		'yDO' : 132
	},
	{
		'score' : 5,
		'xSO' : -36,
		'ySO' : 102,
		'xDO' : 32,
		'yDO' : 107
	},
	{
		'score' : 4,
		'xSO' : 88,
		'ySO' : 63,
		'xDO' : 81,
		'yDO' : -107
	},
	{
		'score' : 3,
		'xSO' : -1,
		'ySO' : -108,
		'xDO' : 37,
		'yDO' : 108
	},
	{
		'score' : 2,
		'xSO' : 61,
		'ySO' : -85,
		'xDO' : 83,
		'yDO' : -106
	},
	{
		'score' : 1,
		'xSO' : 33,
		'ySO' : 105,
}
]

class Game{
	constructor(selectedGame,selectedLength,selectedDifficulty,startingPlayer,nextPlayer){
		this.selectedGame = selectedGame;
		this.selectedGameMaxScore = 0;
		this.selectedLengthCode = selectedLength;
		this.selectedDifficulty = selectedDifficulty;
		this.selectedDifficultyFactor = 0;
		this.currentWinningConditionLeg = '';
		this.currentWinningConditionGame = 0;
		this.startingPlayer = startingPlayer;
		this.currentLeg = 1;
		this.currentRound = 1;
		this.sameRound = true;
		this.currentPlayer = this.startingPlayer;
		this.nextPlayer = nextPlayer;
		this.games = availableGames;
		this.gameLength = availableGameLength;
		this.gameDifficulty = availableGameDifficulty;
	}

	updateCurrentPlayer(){
		this.currentPlayer.resetCurrentDart();
		let temp = this.currentPlayer;
		this.currentPlayer = this.nextPlayer;
		this.nextPlayer = temp;
		this.currentPlayer.updateCurrentPlayerIndicator();
		this.nextPlayer.updateCurrentPlayerIndicator();
		//console.log('swapped players');
		this.updateRound();
		if(this.currentPlayer.id == 'computer'){
			generateThrowsForComputer();
		}
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
	setWinningConditionLeg(){
		for(let i = 0;i < this.games.length; i++){
			if(this.games[i].name.toString() === this.selectedGame.toString()){
				this.currentWinningConditionLeg = this.games[i].winningCondition;
				console.log('Leg winning condition found and set');
			}
		}
	}

	setWinningConditionGame(){
		for(let i = 0;i < this.gameLength.length; i++){
			if(this.gameLength[i].code.toString() === this.selectedLengthCode.toString()){
				this.currentWinningConditionGame = Number(this.gameLength[i].win);
				console.log('Game winning condition found and set');
			}
		}
	}

	checkWinningConditionLeg(){
		if(this.currentWinningConditionLeg == 'firstTo0'){
			if(Number(this.currentPlayer.currentScore) === 0){
				return true
			}

		}
		
		if(this.currentWinningConditionLeg == 'firstTo0DoubleOut'){
			let throws = this.currentPlayer.scores.length;
			throws = throws > 0 ? --throws : throws;
			if(Number(this.currentPlayer.currentScore) === 0 && this.currentPlayer.scores[throws].std.toString() === 'double'){
				return true
			}
		}
		return false;
	}
	
	checkWinningConditionGame(){
		if(Number(game.currentPlayer.legsWon) === Number(this.currentWinningConditionGame)){
			this.currentPlayer.updateHTML(document.getElementById(this.currentPlayer.id + 'Message'),this.currentPlayer.name + ' won the Game!');
			this.nextPlayer.updateHTML(document.getElementById(this.nextPlayer.id + 'Leg'),0);
			this.nextPlayer.initLeg();
			this.currentPlayer.gameWin();
		}
	}

	//Starts a new leg, swaps starting player and initializes players with default variables
	newLeg(){
		this.currentLeg++;
		this.currentRound = 0;
		console.log('New leg started');
		//swap the starting players
		if(this.startingPlayer === this.currentPlayer){
			this.startingPlayer =  this.nextPlayer;
			this.nextPlayer = this.currentPlayer;
			this.currentPlayer = this.startingPlayer;
		}
		else{
			this.startingPlayer = this.currentPlayer;
		}
		
		setTimeout(function(){
			game.currentPlayer.updateHTML(document.getElementById(game.currentPlayer.id + 'Message'),'');
		},1000);
		setTimeout(function(){
			game.nextPlayer.updateHTML(document.getElementById(game.nextPlayer.id + 'Message'),'');
		},1000);

		this.startingPlayer.initScores(this.selectedGame,this.games);
		this.nextPlayer.initScores(this.selectedGame,this.games);

		if(this.currentPlayer.id == 'computer'){
			generateThrowsForComputer();
		}
		//console.log('new starter ' + this.startingPlayer.name + ' new current: ' + this.currentPlayer.name + ' new next ' + this.nextPlayer.name); 
	}

	setStartingScore(){
		for(let i = 0; i < this.games.length; i++){
			if(this.selectedGame.toString() === this.games[i].name.toString()){
				this.selectedGameMaxScore = Number(this.games[i].score);
				break;
			}
		}
	}

	setDifficultyScore(){
		for(i in this.gameDifficulty){
			if(this.gameDifficulty[i].name == this.selectedDifficulty){
				this.selectedDifficultyFactor = Number(this.gameDifficulty[i].factor);
				break;
			}
		}
	}
}

class Player{
	constructor(name){
		this.name = name;
		this.id = '';
		this.scores = [];
		this.currentDart = 0;
		this.dart = 0;
		this.currentScore = 0;
		this.legsWon = 0;
		this.gamesWon = 0;
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
			//check for double out option
			if(game.selectedGame.toString().indexOf('double out') > -1){
				//check if last throw was double
				if(resultToBe === 0){
					if(score.std.toString() === 'double'){
						return true;
					}
					return false;
				}
				//cannot leave 1 score if double out is the option
				if(resultToBe === 1){
					return false;
				}
			}
			return true;
		}
		return false;
	}

	initLeg(){
		this.legsWon = 0;
	}

	legWin(){
		this.legsWon++;
		this.updateHTML(document.getElementById(this.id + 'Message'),this.name + ' won the leg!');
	}

	gameWin(){
		this.gamesWon++;
		this.updateHTML(document.getElementById(this.id + 'Game'),this.gamesWon);
		this.initGame();
	}

	initGame(){
		this.legsWon = 0;
		this.initScores();
	}

	initScores(){
		this.currentDart = 0;
		this.dart = 0;
		this.currentScore = game.selectedGameMaxScore;

		this.updateHTML(document.getElementById(this.id + 'Score'),this.currentScore);
		this.updateHTML(document.getElementById(this.id + 'Leg'),this.legsWon);
		this.updateHTML(document.getElementById(this.id + 'Darts'),this.dart);
		this.updateHTML(document.getElementById(this.id + 'Throw'),'');

		//indicator whose turn is it
		if(this == game.currentPlayer){
			document.getElementById(this.id + 'CurrentPlayer').setAttribute('class','visible');
		}
		if(this == game.nextPlayer){
			document.getElementById(this.id + 'CurrentPlayer').setAttribute('class','notVisible');
		}
	}

	init(){
		if(this.id === '' ){
			this.id = this.name === 'Computer' ? 'computer' : 'player';
		}
		this.updateHTML(document.getElementById(this.id), this.name);
		
		this.initScores();
	}

	updateHTML(element,value){
		element.value = value;
		element.innerHTML = value;
	}

	updateCurrentPlayerIndicator(){
		if(this == game.currentPlayer){
			document.getElementById(this.id + 'CurrentPlayer').setAttribute('class','visible');
		}
		if(this == game.nextPlayer){
			document.getElementById(this.id + 'CurrentPlayer').setAttribute('class','notVisible');
		}
	}
	updateStatistics(){}
}

//Initialize the game
function init(){
	buildPlayer();
	buildGame();
	player.init();
	//updateHTML(document.getElementById("playerScore"),player.currentScore);
	computer.init();
	//updateHTML(document.getElementById("computerScore"),computer.currentScore);

	canvas.addEventListener('mousedown',throwDart, false);
	return canvas;
}

//build players based on the input from user
function buildPlayer(){
	let playerName = document.getElementById('playerName');
	player = new Player(playerName.value);
	computer = new Player('Computer');
}

//build the game based on the input from user
function buildGame(){
	let selectedGame = document.getElementById('games');
	let selectedGameLength = document.getElementById('gameLength');
	let selectedGameDifficulty = document.getElementById('gameDifficulty');
	game = new Game(selectedGame.value,selectedGameLength.value,selectedGameDifficulty.value,player,computer);
	game.setStartingScore();
	game.setWinningConditionLeg();
	game.setWinningConditionGame();
	game.setDifficultyScore();
}

//Build selectable options of games and length for user
function buildOptions(){
	let gamesElement = document.getElementById('games');
	let gameLengthElement = document.getElementById('gameLength');
	let gameDifficultyElement = document.getElementById('gameDifficulty');
	
	buildOptionsHTML(availableGames,gamesElement,'option','name','name','501');
	buildOptionsHTML(availableGameLength,gameLengthElement,'option','name','code','Best of 5');
	buildOptionsHTML(availableGameDifficulty,gameDifficultyElement,'option','name','name','easy');
}

//Helmper for buildOptions function to build the options for the lists
function buildOptionsHTML(array,parent,elementToAdd,innerHTMLValue,valueValue,selected){
	for (i in array){
		let child = document.createElement(elementToAdd);
		child.innerHTML = array[i][innerHTMLValue];
		child.value = array[i][valueValue];
		if(array[i].name == selected){
			child.setAttribute('selected','selected');
		}
		parent.appendChild(child);
	}
}

//Check if name field is filled out
function checkFields(){
	let nameField = document.getElementById('playerName');
	if(nameField.value == ''){
		alert('Please fill out the name field');
	}
	else{
		init();
	}
}

//Get the coordinates of the dart relative to center point of canvas
function throwDart(event){

	let coords = getPosition(event);
	let x = coords[0];
	let y = coords[1];
	
	let offset = setOffsetForPlayer();

	x += offset;
	y+= offset;
	convertCoordToLD(x,y)
}

//Adds random offest to player's throw to make it more diffcult
function setOffsetForPlayer(){
	let selectedFrame =  frameSizeForPlayer * 1/game.selectedDifficultyFactor;

	let randomOffset = Math.random() *selectedFrame - selectedFrame/2;
	return randomOffset;
}

//Generates throw for computer based on difficulty
function generateThrowsForComputer(){
	let selectedFrame =  frameSizeForComputer * game.selectedDifficultyFactor;

	let centerPoint = getCenterPoint();

	let randomXPoint = Math.random() * selectedFrame - selectedFrame/2
	let randomYPoint = Math.random() * selectedFrame - selectedFrame/2
	
	randomXPoint += centerPoint.x;
	randomYPoint += centerPoint.y;
	setTimeout(function (){
		convertCoordToLD(randomXPoint,randomYPoint)
	},1000);
}

//Gets the center point for the throw generated for the computer
function getCenterPoint(){
	let point ={
		'x': 0,
		'y': 0
	}
	
	//Select point based on current score depend on if game is double out or single out
	for(i in centerPoints){
		if(game.currentPlayer.currentScore >= Number(centerPoints[i].score)){
			if(game.currentWinningConditionLeg == 'firstTo0DoubleOut'){
				point.x = centerPoints[i].xDO;
				point.y = centerPoints[i].yDO;
				//need to round the score first
				if(game.currentPlayer.currentScore % 2 == 1 && i > 0){
					let coordinatesFor1Score =  centerPoints.length-1;
					point.x = centerPoints[coordinatesFor1Score].xSO;
					point.y = centerPoints[coordinatesFor1Score].ySO;
				}
			}
			
			if(game.currentWinningConditionLeg == 'firstTo0'){
				point.x = centerPoints[i].xSO;
				point.y = centerPoints[i].ySO;
			}
			break;
		}
	}
	
	return point;
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

//update gameplay, core function of gameplay
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
		game.currentPlayer.updateHTML(document.getElementById(game.currentPlayer.id + "Score"),game.currentPlayer.currentScore);
		game.currentPlayer.updateHTML(document.getElementById(game.currentPlayer.id + "Darts"),game.currentPlayer.dart);
		
		let updateValue = Number(section.score) == 0 ? section.std : section.score;
		game.currentPlayer.updateHTML(document.getElementById(game.currentPlayer.id + "Throw"), updateValue);
		//console.log('Leg: ' + game.currentLeg + ', Round: ' + game.currentRound + ' Score: ' + game.currentPlayer.currentScore +' Throw: ' + game.currentPlayer.currentDart + ' name: ' + game.currentPlayer.name + ' dart: ' + game.currentPlayer.dart);

		let playerWon = game.checkWinningConditionLeg();//check if player won

		if(playerWon){
			game.currentPlayer.legWin();
			console.log(game.currentPlayer.name + ' win legs: ' + game.currentPlayer.legsWon);
			game.checkWinningConditionGame();
			game.newLeg();
			
		}
		//Push player's scores to game scores
		else if(game.currentPlayer.currentDart === 3 || section.busted){
			game.updateCurrentPlayer();
		}
		else if(game.currentPlayer.id === 'computer'){
			generateThrowsForComputer();
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
	
	//Get the x and y relative to the canvas
	//Deal with weird behavior when you scroll the page
	x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	
	//console.log(document.body.scrollLeft);
	
	//Get default canvas location 
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	//Translate the coordinate system
	x = translateX(x);
	y = translateY(y);
	
	var coords = [x,y];
	
	return coords;
}

//Translate the x coordinates to cartesian centered
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

buildOptions();