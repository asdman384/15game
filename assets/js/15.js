$(document).ready(function(){

	initGame15();

});

function initGame15(){

	var game = {

		init: function() {
			this.field = $('#game15').find('.holder');
			this.tiles = this.field.find('.tile');
			this.fakeTile = this.field.find('.tile.fake');
			this.reset = $('#game15').find('input[value=new]');
			this.counter = $('#counter');
			this.count = -1;
			this.winResult = '';
			
			this.buildField();
			this.events();
		},


		buildField: function() {
			this.metaField = [];
			this.count = -1;

			for (var i = 0; i < 16; i++) {
				this.metaField[i] = i + 1;
			}

			this.winResult = this.metaField.slice().join('');
			
			do {
				this.metaField.sort(function(a, b){return Math.random() - 0.5;});
			} while (!this.checkField(this.metaField))

			this.display(this.metaField);
		},


		events: function(){
			this.reset.on('click', this.buildField.bind(this));
			this.tiles.on('click', this.swapElems.bind(this));
		},


		display: function(a){

			this.tiles.removeClass('fake');

			for(var i = 0; i < this.metaField.length; i++){
				var metaIndex = this.metaField[i];
				
				if(metaIndex == 16){
					this.fakeTile = this.tiles.eq(i).addClass('fake');
				}

				this.tiles.eq(i).text(metaIndex);
			}

			this.updateCounter();			
		},


		swapElems: function(e){

			var index = parseInt($(e.currentTarget).text()),
				metaIndex = this.metaField.indexOf(index),
				fakeIndex = this.metaField.indexOf(16),
				tmp = this.metaField[fakeIndex]; 

			if ( ( Math.abs(fakeIndex - metaIndex) == 1 && (Math.floor(fakeIndex/4) == Math.floor(metaIndex/4)) ) || 
				Math.abs(fakeIndex - metaIndex) == 4) {

				this.metaField[fakeIndex] = this.metaField[metaIndex];
				this.metaField[metaIndex] = tmp;

				this.checkIfWin();
				this.display(this.metaField);
			}
		},


		updateCounter: function(){		
			this.counter.text(++this.count);
		},


		checkIfWin: function(){

			if (this.winResult == this.metaField.join('')){
				$('#game15').after('<span>You win</span>')
			}
		}, 


		checkField: function( arr ){ //функция проверки имеет ли сгенерированое поле решение
			var n=0;
			for (var j=0; j<16; j++){
				if ( arr[j]!== 16 ){
					for (var k=j+1 ; k < 16 ; k++){
						if (arr[j] > arr[k] && arr[k]!== 15){
							n++;
						}
					}
				}
				else{
					ryad=Math.floor(j/4)+1;
				}
			}
			n=n+ryad;
			if (n % 2 === 0){
				return true;
			}
			else{
				return false;
			}
		},

		solveField: function (strt, goal){
			var goal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
				strt = [14, 4, 7, 12, 1, 10, 8, 11, 2, 13, 5, 6, 9, 16, 3, 15],
				list = [];// этот лист - цепочка ходов, приводящих к решению задачи


		}
	}

	game.init();
}

