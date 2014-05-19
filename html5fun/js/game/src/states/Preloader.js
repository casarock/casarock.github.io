TubyFlaps.Preloader = function (game) {
	this.background = null;
};

TubyFlaps.Preloader.prototype = {

	preload: function () {
        this.load.image('tubetop', 'images/game/assets/img/pipe-top.png');
        this.load.image('tube', 'images/game/assets/img/pipe.png');
        this.load.image('logo', 'images/game/assets/img/menu_logo.png');
        this.load.spritesheet('bird', 'images/game/assets/img/bird.png', 34, 24, 4);
        this.load.image('ground', 'images/game/assets/img/land_w.png');
	},

	create: function () {
	},

	update: function () {
		this.game.state.start('MainMenu');
	}

};
