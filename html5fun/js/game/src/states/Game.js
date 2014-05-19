TubyFlaps.Game = function (game) {
    this.game = game;
    this.game.score = 0;
    this.game.highscore = 0;
};

TubyFlaps.Game.prototype = {
	create: function () {
        this.game.stage.backgroundColor = '#AFD8FA';

        this.tubes = this.game.add.group();
        this.tubey = new Tube('2', this.game, this.tubes);
        this.birds = [];
        this.birds.push(new Bird('flapy1', this.game));
        this.birds.push(new Bird('flapy2', this.game, this.game.world.width + 75 + this.game.world.width/2));
        this.key = false;
        this.game.score = 0;

        this.text = game.add.text(30, 20, "Score: \n0", {
            font: "16px Arial",
            fill: "#000000",
            align: "center"
        });

        this.text.anchor.setTo(0.5, 0.5);
        this.land = this.game.add.tileSprite(0, this.game.world.height-48, this.game.world.width, 48, 'ground');
    },

	update: function () {
        if (!this.key && (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.pointer1.isDown)) {
            this.key = true;
            this.tubey.up();
        }

        if (this.game.input.keyboard.justReleased(Phaser.Keyboard.UP, 25) || this.game.input.pointer1.isUp) {
            this.key = false;
        }

        this.tubey.update();

        for(var i = 0, len = this.birds.length; i < len; i++) {
            this.birds[i].update();
            this.game.physics.overlap(this.birds[i].getSprite(), this.tubey.getGroup(), this.collisionHandler, null, this);
        }

        this.renderScore();

        if (!this.tubey.isAlive) {
            this.quitGame();
        }

        this.land.tilePosition.x -= 2.5;
    },

    collisionHandler: function() {
        this.quitGame();
    },

	quitGame: function (pointer) {
		this.game.state.start('MainMenu');
	},

    renderScore: function() {
        this.text.setText("Score: \n" + this.game.score);
    }
};
