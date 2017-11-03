window.onload = function() {
	startGame();
	TweenMax.from(".gameName", 0.5, {opacity:0, scale:0, ease:Bounce.easeOut});
	TweenMax.staggerFrom(".item", 0.5, {opacity:0, y:200, rotation: 360, delay:0.5}, 0.2);
	TweenMax.from(".startGameButton", 0.5, {opacity:0, scale:0, ease:Bounce.easeOut, delay:0.3});
	TweenMax.to(".logo", 2, {width:800});
}


function startGame() {
	var numbersForItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
	createItemsArray();
	function startNewGame() {
		var sunObj = document.getElementById("gameIsOver");
		sunObj.style.opacity = "0";
		sunObj.style.top = "-50px";
		sunObj.style.left = "-50px";
		
		var numbersForItemsArray = document.getElementsByClassName("item");
		//Can I optimase this ...?
		for(var t = 0; t < numbersForItemsArray.length; ++t) {
			y = numbersForItemsArray[t].childNodes[0];
			if( y != undefined) { 
				numbersForItemsArray[t].removeChild(y);
			}
		}
				
		var arrClearFix = document.getElementsByClassName("clearfix");
		var parent = document.getElementById("gamefield");
		for(var t = numbersForItemsArray.length - 1; t >= 0 ; --t) {
			parent.removeChild(numbersForItemsArray[t]);
		}
		//Can I optimase this ...?
		for(var t = 0; t < arrClearFix.length; ++t) {
				parent.removeChild(arrClearFix[t]);
		}
		parent.removeChild(document.getElementsByClassName("startGameButton")[0]);
		startGame();
	}
	// create array of Items
	function createItemsArray() {
		shuffle();
		for(var i = 0; i < numbersForItems.length; ++i) {
			
			var node = document.createElement("div");                
			var textnode = document.createTextNode(numbersForItems[i]);
			node.className = "item";
			if(numbersForItems[i] == 16) 
				node.className = "item empty";
			else {
				node.appendChild(textnode); 
				node.addEventListener("mouseenter", shiftItem);
			}
			document.getElementById("gamefield").appendChild(node); 
			
			if(i == 3 || i == 7 || i == 11 || i == 15) {
				var clearfixNode = document.createElement("div"); 
				clearfixNode.className = "clearfix";
				document.getElementById("gamefield").appendChild(clearfixNode); 
			}
		}
		var numbersForItemsArray = document.getElementsByClassName("item");
		var StartButton = document.createElement("div"); 
		StartButton.className = "startGameButton";
		textnode = document.createTextNode("START");
		StartButton.appendChild(textnode); 
		document.getElementById("gamefield").appendChild(StartButton);
		document.getElementsByClassName("startGameButton")[0].addEventListener("click", startNewGame);	
	
	}
	
	// shuffle numbersForItems
	function shuffle() {
		for( var k = 200; k > 0; --k) {
			var i = numbersForItems.indexOf(16);
			var arrSupIndex = [];
			
			if (i - 1 >= 0 && i != 4 && i != 8 && i != 12)  arrSupIndex.push(i - 1);
			if (i + 1 < 16 && i != 3 && i != 7 && i != 11 && i != 15)  arrSupIndex.push(i + 1);	
			if (i - 4 > 0) arrSupIndex.push(i - 4);	
			if (i+4 < 16)arrSupIndex.push(i + 4);
			var ind = Math.floor((Math.random() * arrSupIndex.length));
			var tempEl =  numbersForItems[i];
			numbersForItems[i] = numbersForItems[arrSupIndex[ind]];
			numbersForItems[arrSupIndex[ind]] = tempEl;
		}
	}
		
	function checkGameEnding(){
		
		var bEndGame = true;
		for(var t = 0; t < numbersForItems.length - 1; ++t) {
			if(numbersForItems[t] != t + 1) {
				bEndGame = false;
				break;
			}
		}
		if(bEndGame == true) {
			var sunObj = document.getElementById("gameIsOver");
			sunObj.style.opacity = "1";
			sunObj.style.top = "0";
			sunObj.style.left = document.getElementById("gamefield").getBoundingClientRect().left + document.body.scrollLeft;
			TweenMax.staggerFrom("#gameIsOver", 0.5, {opacity:0, y:0, rotation: 360, delay:0.5}, 0.2);
			var numbersForItemsArray = document.getElementsByClassName("item");
			for(var t = 0; t < numbersForItemsArray.length; ++t) {
				numbersForItemsArray[t].removeEventListener("mouseenter", shiftItem);
			}
		}
	}
	
	function shiftItem(){
		var rect = this.getBoundingClientRect();
		var curX = rect.left + 30;
		var curY = rect.top + 30;
		//finding supposed empty item's position
		var arrPositions = [
			{x: curX - 60 , y: curY},
			{x: curX , y: curY - 60},
			{x: curX + 60 , y: curY},
			{x: curX , y: curY + 60}
		];
	
	
		for(var i = 0; i < arrPositions.length; ++i) {
			var emptyElem = document.elementFromPoint(arrPositions[i].x, arrPositions[i].y);
			if(emptyElem == null) continue;				
			if(emptyElem.className == "item empty") {
				var curItemLeft = 0;
					curItemTop = 0;
					emptyItemTop = 0;
					emptyItemLeft = 0;
				curItemLeft = (this.style.left != 0) ? parseInt(this.style.left) : 0;
				curItemTop = (this.style.top != 0) ? parseInt(this.style.top) : 0;
				if(Math.abs(curItemLeft)%66 != 0 || Math.abs(curItemTop)%66 != 0){
					return;
				}
				this.removeEventListener("mouseenter", shiftItem);
				var speedN = 0.1;
				var distanceToNeighborCell = 66;
				
				switch (i) {
					case 0:
						TweenMax.to(this, speedN, {left:curItemLeft - distanceToNeighborCell});
						emptyItemLeft = (emptyElem.style.left != 0) ? parseInt(emptyElem.style.left) : 0;
						TweenMax.to(emptyElem, speedN, {left: emptyItemLeft + distanceToNeighborCell});
						this.addEventListener("mouseenter", shiftItem);		
						
						break;
					case 1:
						TweenMax.to(this, speedN, {top:curItemTop - distanceToNeighborCell});
						emptyItemTop = (emptyElem.style.top != 0) ? parseInt(emptyElem.style.top) : 0;
						TweenMax.to(emptyElem, speedN, {top:emptyItemTop + distanceToNeighborCell});
						this.addEventListener("mouseenter", shiftItem);		
						break;
					case 2:
						TweenMax.to(this, speedN, {left:curItemLeft + distanceToNeighborCell});
						emptyItemLeft = (emptyElem.style.left != 0) ? parseInt(emptyElem.style.left) : 0; 
						TweenMax.to(emptyElem, speedN, {left: emptyItemLeft - distanceToNeighborCell});
						this.addEventListener("mouseenter", shiftItem);
						break;
					case 3:
						TweenMax.to(this, speedN, {top:curItemTop + distanceToNeighborCell});
						emptyItemTop = (emptyElem.style.top != 0) ? parseInt(emptyElem.style.top) : 0; 
						TweenMax.to(emptyElem, speedN, {top:emptyItemTop - distanceToNeighborCell});
						this.addEventListener("mouseenter", shiftItem);									
						break;
				
					}
										
					var t1 = numbersForItems.indexOf(16);
					var t2 = numbersForItems.indexOf(parseInt(this.innerHTML));
					
					var tt = numbersForItems[t1];
					numbersForItems[t1] = numbersForItems[t2];
					numbersForItems[t2] = tt;
					//console.log(numbersForItems);
					break;
					
				
			}
				
			
		}
		checkGameEnding();
	}
 
}