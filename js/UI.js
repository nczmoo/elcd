class UI{
	flashingPrincesses = [];
	width = 30;
	height = 60;
	animationInterval = setInterval(this.animationLoop, 100);
	constructor(){
		this.refreshBackground();
	}

	animationLoop(){
		
		for (let i in ui.flashingPrincesses){						
			let princess = ui.flashingPrincesses[i];
			
			if (princess.on){
				game.assign(princess.x, princess.y, 'princess-' + princess.state);
				ui.flashingPrincesses[i].flashed++;	
			} else {
				game.assign(princess.x, princess.y, 'background');
			}
			ui.flashingPrincesses[i].on = ! ui.flashingPrincesses[i].on;
			if(ui.flashingPrincesses[i].flashed > 3 && ui.flashingPrincesses[i].on){

				ui.flashingPrincesses.splice(i, 1);
			}
		}
	}

	delta(id, change){
		//console.log(id, change);
		$("#" + id + "-delta").removeClass('d-none');
		setTimeout(function(){
			$("#" + id + "-delta").addClass('d-none');
		}, 500)
		if (change < 0){
			$("#" + id + '-delta').html("(" + change + ")");
			$("#" + id + "-delta").removeClass('text-success');

			$("#" + id + '-delta').addClass('text-danger');
			return;
		}
		$("#" + id + "-delta").html("(+" + change + ")");
		$("#" + id + "-delta").removeClass('text-danger');
		$("#" + id + "-delta").addClass('text-success');
	}

	refresh(){
		//https://www.imgonline.com.ua/eng/cut-photo-into-pieces.php
		$("#corn").html(game.inventory.corn);
		$("#corn").removeClass('text-danger');
		if (game.inventory.corn < 1){
			$("#corn").addClass('text-danger');
		}
		$("#score").html(game.score);
		game.assign(game.elotero.x, game.elotero.y, 'elotero');
		let filename = '', n = 1, txt = '';

		for (let y = 1; y <= game.config.maxY; y++ ){
			txt += "<div>";
			for (let x = 1; x <= game.config.maxX; x++ ){
				filename = n;
				if (n < 10){
					filename = '0' + n;
				}					

				txt += "<img src='img/" + game.map[x][y] 
					+ "-" + x + "-" + y + ".png' width='" + this.width + "' height='" + this.height + "'>"
				n++;
			}
			txt += "</div>";
		}
		$("#board").html(txt);

	}

	refreshBackground(){
		let filename = '', n = 1, txt = '';
	
		for (let y = 1; y <= game.config.maxY; y++ ){
			txt += "<div>";
			for (let x = 1; x <= game.config.maxX; x++ ){
				filename = n;
				if (n < 10){
					filename = '0' + n;
				}					

				txt += "<img src='img/background"
					+ "-" + x + "-" + y + ".png' width='" + this.width + "' height='" + this.height + "'>"
				n++;
			}
			txt += "</div>";
		}
		$("#background").html(txt);
	}

	formatID(id){
		return Number(id) + 1;
	}

	menu(id){		
		$(".window").addClass('d-none');
		$("#" + id.split('-')[1]).removeClass('d-none');
		$(".menu").prop('disabled', false);
		$("#" + id).prop('disabled', true);
	}

	move(oldX, oldY, newX, newY){
		this.images[oldX][oldY] = 'background';
		this.images[newX][newY] = 'elotero';
	}
}