class Game{
	elotero = {x: 1, y: 5};
	config = new Config();
	corns = [];
	inventory = {corn: 1};
	jumped = null;
	
	loop = new Loop();
	loopInterval = null;
	map = [];
	magas = [];
	minBlocks = 3;
	maxBlocks = 7;
	princesses = [];
	corn = null;
	score = 0;
	screenID = 0;
	screens = [];
	step = 0;
	constructor(){		
		this.loopInterval = setInterval(this.loop.looping, 100);
		for (let x = 0; x <= this.config.maxX ; x ++){
			this.map[x] = new Array(this.config.maxY + 1);
		}
		this.generateBlankWorld();

		this.generateWorld(false);

		for (let maga of this.magas){
			this.map[maga.x][maga.y] = 'maga';
		}
		for (let princess of this.princesses){
			this.map[princess.x][princess.y] = 'princess-happy';
		}
	}

	areThereBlocksBtw(y, oldX, newX){
		
		for (let x = oldX; x > newX; x--){
			let onGround = this.isOnGround(x, y);
			if (!onGround){
				return false;
			}
		}
		return true;
	}

	assign(x, y, name){
		if (x < 1 || y < 1 || x > this.config.maxX || y > this.config.maxY){
			return;
		}
		this.map[x][y] = name;
	}

	checkMaga(y, oldX, newX){
		for (let i in this.magas){
			let maga = this.magas[i];
			if (maga.y == y && ((oldX < maga.x && newX > maga.x) || (oldX > maga.x && newX < maga.x )) ){
				this.assign(maga.x, maga.y, 'background');
				this.magas.splice(i, 1);
				this.score++;
				ui.delta('score', +1);
				return true;
			}			
		}
		return false;
	}

	checkPrincess(y, oldX, newX, state){
		
		for (let i in this.princesses){
			let princess = this.princesses[i];
			if (state == 'happy' && this.inventory.corn < 1){
				continue;
			}
			if (princess.y == y && ((oldX < princess.x && newX > princess.x) || ( oldX > princess.x && newX < princess.x )) ){
				this.princessDies(i, state);				
				return true;
			}
		}
		return false;
	}

	cornThrown(){
		if (this.corn == null){
			return;
		}
		if (this.corn.x == null){
			this.assign(this.elotero.x, this.elotero.y, 'elotero-corn');
			this.corn.x = this.elotero.x ;
			return;
		}
		if (this.map[this.corn.x][this.corn.y] == 'corn'){
			this.assign(this.corn.x, this.corn.y, 'background');
		}
		let pCheck = this.checkPrincess(this.corn.y, this.corn.x, this.corn.x + 2, 'sad');
		let mCheck = this.checkMaga(this.corn.y, this.corn.x, this.corn.x + 2);
		
		if (mCheck || pCheck){
			if (this.map[this.corn.x][this.corn.y] == 'corn'){
				this.assign(this.corn.x, this.corn.y, 'background');
			} else if (this.map[this.corn.x][this.corn.y] == 'elotero-corn'){
				this.assign(this.corn.x, this.corn.y, 'elotero-throw');
			}
			this.corn = null;

			return;
		}
		this.corn.x += 2;
		if (this.corn.x > this.config.maxX){
			this.corn = null;
			return;
		}
		

		this.assign(this.corn.x, this.corn.y, 'corn');
		if (this.map[this.elotero.x][this.elotero.y] == 'elotero-corn'){
			this.assign(this.elotero.x, this.elotero.y, 'elotero-throw');
		}

	}

	die(){
		alert('You died!');
		location.reload();
	}

	fall(){
		let posX = this.elotero.x;
		let posY = this.elotero.y + 2;
		let falling = true;
		
		if (this.isOnGround(this.elotero.x, this.elotero.y)){		
			falling = false;	
			this.jumped = null;					
		}
		
		
		if (falling ){
			this.assign(this.elotero.x, this.elotero.y, 'background');
			this.assign(posX, posY, 'elotero');			
			this.elotero.y = posY;			
		}
		
	}

	generateCopy(){
		this.screens[this.screenID].map = [];
		for (let x = 0; x <= this.config.maxX ; x ++){
			this.screens[this.screenID].map[x] = new Array(this.config.maxY + 1);
		}
		for (let y = 1; y <= this.config.maxY; y++ ){		
			for (let x = 1; x <= this.config.maxX; x++ ){
				this.screens[this.screenID].map[x][y] = this.map[x][y];				
			}
		}
	}

	generateBlankWorld(){
		for (let y = 1; y <= this.config.maxY; y++ ){		
			for (let x = 1; x <= this.config.maxX; x++ ){
				this.map[x][y] = 'background';
				
			}
		}
	}

	generateWorld(old){
		console.log('generate');
		if (old){
			this.saveScreen();
			this.screenID++;
			this.generateBlankWorld();
			this.corns = [];
			this.magas = [];
			this.princesses = [];
			ui.flashingPrincesses = [];
		}
		let blocksY = [2, 4];
		let blocksX = [1, 3, 5, 7, 9];
		let cornsY = [1, 3, 5];
		let i = 0;
		let princessX = [4, 8];
		let numOfBlocks = randNum(this.minBlocks, this.maxBlocks);
		let blocks = [];
		let corns = [];
		console.log('generate blocks');
		while (blocks.length < numOfBlocks){
			let randX = blocksX[randNum(0, blocksX.length - 1)];
			let randY = blocksY[randNum(0, blocksY.length - 1)];
			let str = randX + "-" + randY;			
			if (!blocks.includes(str)){
				blocks.push(str);
			}	
		}
		for (let block of blocks){
			let x = Number(block.split('-')[0]);
			
			let y = Number(block.split('-')[1]);
			
			this.assign(x, y, 'block');
			
			this.assign(x + 1, y, 'block');
			
		}
		console.log('generate corn');
		let numOfCorn = randNum(1, 3 - this.inventory.corn);
		if (numOfCorn < 1){
			numOfCorn = 1;
		}
		while(corns.length < numOfCorn){
			let randX = blocksX[randNum(0, blocksX.length - 1)];
			let randY = cornsY[randNum(0, cornsY.length - 1)];
			let str = randX + "-" + randY;
			if (!corns.includes(str)){
				corns.push(str);
			}	
		}
		for (let corn of corns){
			let x = Number(corn.split('-')[0]);
			let y = Number(corn.split('-')[1]);
			this.assign(x, y, 'corn');
			this.corns.push({ x: x, y: y });
		}
		
		console.log('generate magas');
		while(1){
			let randX = 10;
			let randY = cornsY[randNum(0, cornsY.length - 1)];					
			if (this.isOnGround(randX, randY) && this.map[randX][randY] == 'background' && ((i < 5 && randY != 5) || (i >= 5)) ){
				this.magas.push({ x: randX, y: randY });
				this.assign(randX, randY, 'maga');
				break;
			}
			i++;
		}
		i = 0;
		console.log('generate princesses');
		while(1){
			let randX = princessX[randNum(0, princessX.length - 1)];
			let randY = cornsY[randNum(0, cornsY.length - 1)];		
		
			if (this.isOnGround(randX, randY) && this.map[randX][randY] == 'background' && ((i < 10 && randY != 5) || (i >= 10)) ){
				this.princesses.push({ x: randX, y: randY });
				this.assign(randX, randY, 'princess-happy');
				break;
			}
			i++;
		}
		
	}

	input(button){
		//console.log(button);
		let wasd = { w: 'Up', a: "Left", s: "Down", d: "Right" };
		if (button == ' ' || button == 'Enter'){
			this.throw();
			return;
		}
		
		let direction = button.substring(5);
		if (Object.keys(wasd).includes(button)){
			direction = wasd[button];
		}
		let directions = ['Up', 'Right', 'Down', 'Left'];
		if (!directions.includes(direction)){
			return;
		}
		this.move(direction);
	}

	isOnGround(x, y){
		//console.log(x, y);
		if (x < 1 || y < 1 || x > this.config.maxX || y > this.config.maxY){
			return;
		}
		return (this.map[x][y + 1] == 'block' || y == 5);

		
	}

	loadScreen(){

		this.map = this.screens[this.screenID].map.slice();
		this.corns = this.screens[this.screenID].corns.slice();
		this.magas = this.screens[this.screenID].magas.slice();
		this.princesses =	this.screens[this.screenID].princesses.slice();
		ui.refresh();
	}

	magasFall(){
		for (let i in this.magas){
			let maga = this.magas[i];
			if (!this.isOnGround(maga.x, maga.y)){
				this.assign(maga.x, maga.y, 'background');
				this.magas[i].y += 2;			
				this.assign(maga.x, maga.y, 'maga');	
				continue;
			}
		}	
	}

	magasMove(){
		for (let i in this.magas){
			let maga = this.magas[i];
			let posX = maga.x - 4;
			this.assign(maga.x, maga.y, 'background');		
			let blocksHere = this.areThereBlocksBtw(maga.y, maga.x, posX);
			if (!blocksHere ){
				this.magas[i].y += 2;
			}
			if (this.elotero.y == maga.y && maga.x > this.elotero.x && posX < this.elotero.x){
				this.die();
			} else if (this.checkPrincess(maga.y, maga.x, posX, 'sad')){

			}
			if (posX < 1){
				
				this.magas.splice(i, 1);
				continue;
			}

			this.magas[i].x = posX;
			this.assign(maga.x, maga.y, 'maga');
		}
		
	}

	move(direction){
		let deltasX = {
			Up: 0, Down: 0, Right: 2, Left: -2
		}
		let deltasY = {
			Up: -2, Down: 0, Right: 0, Left: 0
		}

		let deltaX = deltasX[direction];
		let deltaY = deltasY[direction];
		let posX = this.elotero.x + deltaX;
		let posY = this.elotero.y + deltaY;
		if (posY < 1 || posY > this.config.maxY){
			return;
		} else if (direction == 'Up' && (!this.isOnGround(this.elotero.x, this.elotero.y) || this.map[this.elotero.x][this.elotero.y - 1] == 'block')){
			return;
		}
		this.assign(this.elotero.x, this.elotero.y, 'background');
		if (direction == 'Right' && posX > this.config.maxX && this.screens.length < this.screenID + 2){
			this.generateWorld(true);
			this.elotero.x = 1;			
			ui.refresh();
			return;
		} else if (direction == 'Right' && posX > this.config.maxX){
			this.screenID ++;
			this.elotero.x = 1;

			this.loadScreen();
			return;
		} else if (direction == 'Left' && posX < 1 && this.screenID - 1 > -1){
			this.saveScreen();
			this.elotero.x = 9;

			this.screenID --;
			this.loadScreen();
			return;
		} 
		
		
		if (direction == 'Up'){
			this.jumped = 1;
		}
		if (this.map[posX][posY] == 'corn'){
			ui.delta('corn', 1);
			this.inventory.corn ++;
		}

		if (this.checkMaga(this.elotero.y, this.elotero.x, posX)){
			this.die();
		} else if (this.checkPrincess(this.elotero.y, this.elotero.x, posX, 'happy') && game.inventory.corn > 0){
			game.inventory.corn --;
			game.score ++;
			ui.delta('score', 1);
			ui.delta('corn', -1);
			
		}
		this.assign(posX, posY, 'elotero');		
		this.elotero.x = posX;
		this.elotero.y = posY;
		ui.refresh();
	}

	princessDies(princessID, state){
		if (state == 'sad'){
			this.score -= 2;
			ui.delta('score', -2);
		}
		let princess = this.princesses[princessID];
		this.assign(princess.x, princess.y, 'princess-' + state);				
		ui.flashingPrincesses.push( { x: princess.x, y: princess.y, time: Date.now(), on: true, flashed: 0, steps: 0, state: state } )
		this.princesses.splice(princessID, 1);
	}

	saveScreen(){
		this.screens[this.screenID] = {};			
		this.generateCopy();
		this.screens[this.screenID].corns = this.corns.slice();
		this.screens[this.screenID].magas = this.magas.slice();
		this.screens[this.screenID].princesses = this.princesses.slice();
	}

	throw(){
		if (this.inventory.corn < 1){
			return;
		}
		ui.delta('corn', -1);
		this.inventory.corn --;
		this.corn = {};
		this.corn.x = null;
		this.corn.y = this.elotero.y;
	}


}
