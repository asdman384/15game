$(document).ready(function(){

	initGame15();

});

function initGame15(){

	var game = {

		animation: function(items, i) {
			setTimeout(function() {
				$(items[i]).addClass('show');
				if(++i < items.length)
					this.animation(items, i);
			}.bind(this), 60);
		},

		init: function(VK) {
			this.game =  $('#game15');
			this.tiles = this.game.find('.tile');
			this.reset = this.game.find('.new');
			this.counter = this.game.find('#counter');
			this.tableContent = $('.tour-table').find('.table-content');

			this.count = -1;
			this.winResult = '';
			this.user = {};
			this.oldResult = '';
			this.tourTableData = [];

			this.buildField();
			this.events();

			VK.init(
				function() {
					// API initialization succeeded
					console.log('succeeded');
					this.getUser();
					this.getStorageKeys();

				}.bind(this),

				function() {
					// API initialization failed
					// Can reload page here
					console.log('failed');
				},

				'5.37'
			);

		},

		getUser: function (){

			VK.api(
				'users.get',
				{
					fields: 'photo_50'
				},
				function(data) {

					if (data.response){
						this.user = data.response[0];
					}
				}.bind(this)
			);
		},

		buildField: function() {
			this.game.find('span').remove( ":contains('You win')" );
			this.tiles.removeClass('show');
			this.game.removeClass('stop');
			this.animation(this.tiles, 0);

			this.metaField = [];
			this.count = -1;

			for (var i = 0; i < 16; i++) {
				this.metaField[i] = i + 1;
			}

			this.winResult = this.metaField.slice().join('');
			
			do {
				this.metaField.sort(function(a, b){return Math.random() - 0.5;});
			} while (!this.checkField(this.metaField))

			this.display();
		},

		events: function(){
			this.reset.on('click', this.buildField.bind(this));
			this.tiles.on('click', this.swapElems.bind(this));
		},


		display: function(){
			this.tiles.removeClass('fake');

			for(var i = 0; i < this.metaField.length; i++){
				var metaIndex = this.metaField[i];
				
				if(metaIndex == 16){
					this.tiles.eq(i).addClass('fake');
				}
				this.tiles.eq(i).text(metaIndex);
				//this.tiles.eq(i).css('background-color', 'rgb('+((metaIndex*5)+180) +',0,255)')
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

				this.display();
				this.checkIfWin();

			}
		},

		updateCounter: function(){		
			this.counter.text(++this.count);
		},

		checkIfWin: function(){
			if (this.winResult == this.metaField.join('')){
				$('.stats').append('<span>You win</span>');
				//this.tiles.removeClass('show');
				this.game.addClass('stop');

				if (this.oldResult != '') {
					if (this.oldResult >= this.count) {
						this.setStorage(this.count);
						setTimeout(this.getStorageKeys.bind(this), 1000);
					}
				} else {
					this.setStorage(this.count);
					setTimeout(this.getStorageKeys.bind(this), 1000);
				}
			}
		},

		setStorage: function(counter){
			VK.api(
				'storage.set',
				{
					key: 'id' + this.user.id,
					value: counter,
					global: 1
				},
				function(data) {

				}
			);
		},

		makeTable: function(usersArray){

			usersArray.sort(
				function(a,b) {
					return a.value - b.value;
				})
			;

			var user_ids ='';
			for (var i = 0; i< 10; ++i ){
				if (usersArray[i]){
					user_ids += usersArray[i].key + ',';
				}
			}

			VK.api(
				'users.get',
				{
					fields: 'photo_50',
					user_ids : user_ids
				},
				function(table){

					return function(usersData) {

						if (usersData.response) {
							for (var i = 0; i < 10; ++i) {
								if (table[i]) {
									var founded = usersData.response.find(function (item) {
										return ('id' + item.id) == this;
									}, table[i].key);

									if (table[i].key == ('id' + this.user.id))
										this.oldResult = table[i].value;

									var a = $('<a></a>')
										.attr('href', "http://vk.com/" + table[i].key)
										.attr('target', '_blank')
										.html(
										'<div class="avatar">' +
										'<img src="'+ founded.photo_50 +'">'+
										'</div>' +
										'<span class="name">'+founded.first_name+'</span>'
									);

									var td1 = $('<td></td>');
									td1.append(a);
									var td2 = $('<td></td>');
									td2.html('<span class="points">'+table[i].value+'</span>');
									var tr = $('<tr></tr>');
									tr.append(td1);
									tr.append(td2);
									this.tableContent.append(tr);
								}
							}

							this.tableContent.find('td').addClass('hide');
							this.animation(this.tableContent.find('td'),0)
						}
					}.bind(this)
				}.bind(this)(usersArray))
			;
		},

		getStorageValues: function(keys){
			VK.api(
				'storage.get',
				{
					keys: keys.join(','),
					global: 1
				},
				function(data) {
					if (data.response) {
						this.makeTable(data.response)
					}
				}.bind(this)
			);
		},

		getStorageKeys: function(){
			this.tableContent.empty();
			VK.api(
				'storage.getKeys',
				{
					offset: 0,
					count: 999,
					global: 1
				},
				function(data) {
					if (data.response) {
						this.getStorageValues(data.response);
					}
				}.bind(this))
			;
		},

		checkField: function( arr ){
			var n= 0,
				row;
			for (var j=0; j<16; j++){
				if ( arr[j]!== 16 ){
					for (var k=j+1 ; k < 16 ; k++){
						if (arr[j] > arr[k] && arr[k]!== 15){
							n++;
						}
					}
				}
				else{
					row=Math.floor(j/4)+1;
				}
			}
			n=n+row;
			return n % 2 === 0;
		},

		solveField: function (strt, goal){
			var goal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
				strt = [14, 4, 7, 12, 1, 10, 8, 11, 2, 13, 5, 6, 9, 16, 3, 15],
				list = [];// этот лист - цепочка ходов, приводящих к решению задачи
		}
	};

	game.init(VK);
}

