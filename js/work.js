"use strict"; 
window.onload = function() {
	var gameObj = new Game();
	TweenMax.from(".gameName", 0.5, {opacity:0, scale:0, ease:Bounce.easeOut});
	TweenMax.staggerFrom(".item", 0.5, {opacity:0, y:200, rotation: 360, delay:0.5}, 0.2);
	TweenMax.from(".startGameButton", 0.5, {opacity:0, scale:0, ease:Bounce.easeOut, delay:0.3});
	TweenMax.to(".logo", 2, {width:800});
}

var Game = function () {
	this.sunObj = 0; //congratulationObj
	Game.numbersForItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
	this.startGame();
}
// Remove all items from gamefield for start new game
Game.prototype.cleanGameField = function() {
	var numbersForItemsArray = document.getElementsByClassName("item"),
		arrClearFix = document.getElementsByClassName("clearfix"),
		t = 0,
		y = 0,
		parent = document.getElementById("gamefield");
	
	this.sunObj = document.getElementById("gameIsOver");	
	this.sunObj.style.opacity = "0";
	this.sunObj.style.top = "-50px";
	this.sunObj.style.left = "-50px";
	
	for(t = numbersForItemsArray.length - 1; t >= 0; --t) {
		y = numbersForItemsArray[t].childNodes[0];
		if( y != undefined) { 
			numbersForItemsArray[t].removeChild(y);
		}
	}
	for(t = numbersForItemsArray.length - 1; t >= 0 ; --t) {
		parent.removeChild(numbersForItemsArray[t]);
	}
	for(t = arrClearFix.length - 1; t >= 0 ; --t) {
		parent.removeChild(arrClearFix[t]);
	}
	if(document.getElementsByClassName("startGameButton")[0]) 
		parent.removeChild(document.getElementsByClassName("startGameButton")[0]);
}
Game.prototype.createItems = function() {
	var startGameButton = null,
		node = null,                
		textnode = null,
		clearfixNode = null,
		i = 0,
		itemsLength = Game.numbersForItems.length;
		
	this.shuffleItems();
	
	for(i = 0; i < itemsLength; ++i) {
		node = document.createElement("div");                
		textnode = document.createTextNode(Game.numbersForItems[i]);
		node.className = "item";
		if(Game.numbersForItems[i] == 16) 
			node.className = "item empty";
		else {
			node.appendChild(textnode); 
			node.addEventListener("mouseenter", Game.shiftItem);
		}
		document.getElementById("gamefield").appendChild(node); 
		
		if(i == 3 || i == 7 || i == 11 || i == 15) {
			clearfixNode = document.createElement("div"); 
			clearfixNode.className = "clearfix";
			document.getElementById("gamefield").appendChild(clearfixNode); 
		}
	}
	startGameButton = document.createElement("div"); 
	startGameButton.className = "startGameButton";
	textnode = document.createTextNode("START");
	startGameButton.appendChild(textnode); 
	document.getElementById("gamefield").appendChild(startGameButton);
	this.startGame = this.startGame.bind(this);
	document.getElementsByClassName("startGameButton")[0].addEventListener("click", this.startGame);
}

Game.prototype.startGame = function() {
	this.cleanGameField();
	this.createItems();
}
Game.prototype.shuffleItems = function() {
	var k = 0,
		i = Game.numbersForItems.indexOf(16),
		arrSupIndex = [],
		ind = 0,
		tempEl = 0;
	
	for(k = 200; k > 0; --k) {
		if (i - 1 >= 0 && i != 4 && i != 8 && i != 12)  arrSupIndex.push(i - 1);
		if (i + 1 < 16 && i != 3 && i != 7 && i != 11 && i != 15)  arrSupIndex.push(i + 1);	
		if (i - 4 > 0) arrSupIndex.push(i - 4);	
		if (i + 4 < 16) arrSupIndex.push(i + 4);
		ind = Math.floor((Math.random() * arrSupIndex.length));
		
		tempEl =  Game.numbersForItems[i];
		Game.numbersForItems[i] = Game.numbersForItems[arrSupIndex[ind]];
		Game.numbersForItems[arrSupIndex[ind]] = tempEl;
		arrSupIndex = [];
		i = Game.numbersForItems.indexOf(16);
	}
}
Game.checkGameEnding = function() {
	var bEndGame = true,
		numberCounts = this.numbersForItems.length - 1,
		sunObj = document.getElementById("gameIsOver"),
		numbersForItemsArray = document.getElementsByClassName("item"),
		numbersForItemsArrayLength = numbersForItemsArray.length,
		t = 0;
		
	for(t = 0; t < numberCounts; ++t) {
		if(this.numbersForItems[t] != t + 1) {
			bEndGame = false;
			break;
		}
	}
	if(bEndGame == true) {
		sunObj.style.opacity = "1";
		sunObj.style.top = "0";
		sunObj.style.left = "50%";
		TweenMax.staggerFrom("#gameIsOver", 0.5, {opacity:0, y:0, rotation: 360, delay:0.5}, 0.2);
		
		for(var t = 0; t < numbersForItemsArrayLength; ++t) {
			numbersForItemsArray[t].removeEventListener("mouseenter", Game.shiftItem);
		}
	}
}
Game.shiftItem = function() {
	var rect = this.getBoundingClientRect(),
		curX = rect.left + 30,
		curY = rect.top + 30,
		arrPositions = [ //The supposed position for empty item 
			{x: curX - 60 , y: curY},
			{x: curX , y: curY - 60},
			{x: curX + 60 , y: curY},
			{x: curX , y: curY + 60}
		],
		curItemLeft = 0,
		curItemTop = 0,
		emptyItemTop = 0,
		emptyItemLeft = 0,
		emptyElem = null,
		speedN = 0.1,
		distanceToNeighborCell = 66,
		swapElement = null,
		swapEmptyCell = null,
		i = 0,
		temp = 0;

	for(i = 0; i < arrPositions.length; ++i) {
		emptyElem = document.elementFromPoint(arrPositions[i].x, arrPositions[i].y);
		if(emptyElem == null) continue;				
		if(emptyElem.className == "item empty") {
			curItemLeft = (this.style.left != 0) ? parseInt(this.style.left) : 0;
			curItemTop = (this.style.top != 0) ? parseInt(this.style.top) : 0;
			if(Math.abs(curItemLeft)%66 != 0 || Math.abs(curItemTop)%66 != 0){
				return;
			}
			this.removeEventListener("mouseenter", Game.shiftItem);
						
			switch (i) {
				case 0:
					TweenMax.to(this, speedN, {left:curItemLeft - distanceToNeighborCell});
					emptyItemLeft = (emptyElem.style.left != 0) ? parseInt(emptyElem.style.left) : 0;
					TweenMax.to(emptyElem, speedN, {left: emptyItemLeft + distanceToNeighborCell});
					this.addEventListener("mouseenter", Game.shiftItem);		
					
					break;
				case 1:
					TweenMax.to(this, speedN, {top:curItemTop - distanceToNeighborCell});
					emptyItemTop = (emptyElem.style.top != 0) ? parseInt(emptyElem.style.top) : 0;
					TweenMax.to(emptyElem, speedN, {top:emptyItemTop + distanceToNeighborCell});
					this.addEventListener("mouseenter", Game.shiftItem);		
					break;
				case 2:
					TweenMax.to(this, speedN, {left:curItemLeft + distanceToNeighborCell});
					emptyItemLeft = (emptyElem.style.left != 0) ? parseInt(emptyElem.style.left) : 0; 
					TweenMax.to(emptyElem, speedN, {left: emptyItemLeft - distanceToNeighborCell});
					this.addEventListener("mouseenter", Game.shiftItem);
					break;
				case 3:
					TweenMax.to(this, speedN, {top:curItemTop + distanceToNeighborCell});
					emptyItemTop = (emptyElem.style.top != 0) ? parseInt(emptyElem.style.top) : 0; 
					TweenMax.to(emptyElem, speedN, {top:emptyItemTop - distanceToNeighborCell});
					this.addEventListener("mouseenter", Game.shiftItem);									
					break;
			
				}
							
				swapElement = Game.numbersForItems.indexOf(16);
				swapEmptyCell = Game.numbersForItems.indexOf(parseInt(this.innerHTML));
							
				temp = Game.numbersForItems[swapElement];
				Game.numbersForItems[swapElement] = Game.numbersForItems[swapEmptyCell];
				Game.numbersForItems[swapEmptyCell] = temp;
				break;
		}
	}
	Game.checkGameEnding();
}
