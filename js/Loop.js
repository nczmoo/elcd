class Loop{

    looping(){
        game.step++;
        if (game.corn != null){
            game.cornThrown();
        }
        
        if (game.elotero.y < 5 && (game.jumped == null || game.jumped > 4)){
			game.fall();
		}
        if (game.step % 30 == 0 && game.corn == null){
            game.magasMove();
        } 
        if (game.step % 20){
            game.magasFall();
        }
        
        if (game.jumped != null){
            game.jumped ++;
        }
        ui.refresh();

    }

}