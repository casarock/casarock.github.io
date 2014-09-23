BasicGame.Game = function (game) {
    this.game = game;		//	a reference to the currently running game

    // Settings
    this.direction = 1;
    this.speed = 10;
    this.maxValue = 30;
    this.factor = 0;
    this.start = false;
    this.maxFuel = 1000;
    this.fuel = this.maxFuel;
    this.dead = false;
    this.win = false;
    this.speedX = 0;
    this.gravity = 150;
    this.score = 0;
    this.maxTouchdownVelocity = 400;
    this.originHealthbarWidth = 0;
};

BasicGame.Game.prototype = {

    preload: function () {

        var localAtlasData = {"frames": [
            {"filename": "rocketoff", "frame": {"x": 0, "y": 1, "w": 110, "h": 176}, "rotated": false, "trimmed": false, "spriteSourceSize": {"x": 0, "y": 0, "w": 110, "h": 176}, "sourceSize": {"w": 110, "h": 176}},
            {"filename": "rocketon", "frame": {"x": 0, "y": 179, "w": 110, "h": 243}, "rotated": false, "trimmed": false, "spriteSourceSize": {"x": 0, "y": 0, "w": 110, "h": 243}, "sourceSize": {"w": 110, "h": 243}}
        ],
            "meta": {"app": "http://www.leshylabs.com/apps/sstool/",
                "version": "Leshy SpriteSheet Tool v0.8.1",
                "size": {"w": 110, "h": 424}, "scale": 1}
        };

        this.game.load.atlas('sprites', 'images/myrocket.png', null, localAtlasData, Phaser.Loader
            .TEXTURE_ATLAS_JSON_ARRAY);

        this.game.load.image('platform', 'images/platform.png');
        this.game.load.image('background', 'images/space.jpg');
        this.game.load.image('healthbar', 'images/healthbar.png');
        this.game.load.spritesheet('explosion', 'images/exp2.png', 64, 64);

        window.addEventListener('devicelight', this.handleDeviceLightEvent.bind(this));
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));

    },

    create: function () {
        this.game.stage.backgroundColor = '#ccc';

        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.platform = this.game.add.sprite(this.world.width / 2, this.world.height - 15, 'platform');
        this.rocket = this.game.add.sprite(this.world.width / 2, 160, 'sprites', 'rocketoff');

        this.platform.anchor.setTo(0.5, 0.5);
        this.rocket.anchor.setTo(0.5, 0);

        this.rocket.scale.setTo(0.25, 0.25);
        this.platform.scale.setTo(0.5, 0.5);
        this.game.physics.enable(this.rocket, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
        this.platform.body.setSize(140, 80, -7, 5);

        this.rocket.body.collideWorldBounds = false;
        this.platform.body.immovable = true;

        this.hudScore = this.game.add.text(16,16, "Score: 0", {
            font: "16px Arial",
            fill: "#ccc",
            align: "left"
        });

        this.hudFuel = this.game.add.text(this.game.width - 80, 16, "Fuel", {
            font: "16px Arial",
            fill: "#ccc",
            align: "left"
        });


        this.text = this.game.add.text(32, this.game.world.centerY, "", {
            font: "24px Arial",
            fill: "#fff",
            align: "left"
        });

        this.healthbar = this.game.add.sprite(this.game.width - 112, 32, 'healthbar');
        this.originHealthbarWidth = this.healthbar.width;
        this.cropRect = new Phaser.Rectangle(0, 0, this.healthbar.width, this.healthbar.height);

        this.healthbar.crop(this.cropRect);
        },

    stopMovement: function () {
        this.rocket.body.gravity.y = 0;
        this.rocket.body.velocity.y = 0;
        this.rocket.body.acceleration.y = 0;
        this.rocket.body.velocity.x = 0;
        this.rocket.body.acceleration.x = 0;
        this.speedX = 0;

        if (this.win) {
            this.score += 25;
            this.hudScore.setText("Score: " + this.score);
        }
    },

    reset: function () {
        this.platform.x = 84 + this.game.rnd.integerInRange(0, this.game.world.width - 84);;
        this.platform.y = this.world.height - 15;
        this.rocket.x = this.world.width / 2;
        this.rocket.y = 160;
        this.rocket.body.gravity.y = this.gravity;
        this.rocket.frameName = 'rocketoff';

        this.start = true;

        if (this.fuel <= 0) {
            this.score = 0;
            this.fuel = this.maxFuel;
            this.hudScore.setText("Score: 0")
        }

        this.dead = false;
        this.win = false;
        this.currentRocketVelocity = 0;
    },

    update: function () {
        if (!this.dead && !this.win && this.fuel > 0) {
            this.text.setText("");
            if (this.cursors.left.isDown) {
                this.speedX -= 0.25;
                this.speedX = this.speedX < -40 ? -40 : this.speedX;
            }

            if (this.cursors.right.isDown) {
                this.speedX += 0.25;
                this.speedX = this.speedX > 40 ? 40 : this.speedX;
            }

            this.rocket.body.acceleration.y = this.speed * this.factor;

            this.rocket.frameName = (this.factor < -10 && !this.win) ? 'rocketon' : 'rocketoff';
            this.factor = (this.fuel > 0) ? this.factor : 0;

            this.rocket.body.velocity.y = (this.rocket.body.velocity.y > 350) ? 350 : this.rocket.body.velocity.y;
            this.rocket.body.velocity.y = (this.rocket.body.velocity.y < -350) ? -350 : this.rocket.body.velocity.y;

            this.rocket.body.velocity.x = this.speedX * 10;
            this.fuel += this.factor / 10;

            // Out of bounds....
            if (this.rocket.y < -100) {
                this.dead = true;
                this.stopMovement();
            }

            // Out of fuel: Show score...
            if (this.fuel <= 0) {
                this.stopMovement();
                this.showScore();
            }

            this.currentRocketVelocity = this.rocket.body.velocity.y;
            this.game.physics.arcade.overlap(this.rocket, this.platform, this.collisionHandler, null, this);
            if (this.rocket.y > this.game.world.height + 32) {
                this.dead = true;
                this.stopMovement();
            }

            this.updateHUD();

        } else {
            if (this.fuel > 0) {
                var textString = this.win ? "Good job!" : "You are dead...";
                textString += "\n\n Tap or Space to continue!";
                this.text.setText(textString);
            }
            if (this.game.input.pointer1.isDown || this.spacebar.isDown) {
                this.reset();
            }
        }
    },

    updateHUD: function() {
        this.cropRect.width = (this.fuel / this.maxFuel) * this.originHealthbarWidth;
        this.healthbar.updateCrop();
    },

    showScore: function() {
        var scoreText = "You ran out of Fuel\n";
        scoreText += "Your Score: " + this.score;
        scoreText += "\n\n Touch/Space to restart!"
        this.text.setText(scoreText);
    },

    collisionHandler: function() {
        if (this.currentRocketVelocity > this.maxTouchdownVelocity) {
            this.dead = true;
            this.stopMovement();
            this.showExplosion();
        } else {
            this.win = true;
            this.rocket.y = this.world.height - 15 - 64;
            this.rocket.frameName = 'rocketoff';
            this.stopMovement();

            this.vibrate([75, 100, 50]);
        }
    },

    showExplosion: function () {
        var x = parseInt(this.rocket.x),
            y = parseInt(this.rocket.y);

        var explosion = this.game.add.sprite(x, y, 'explosion');
        explosion.anchor.setTo(0.5, 0);

        this.rocket.x = -100;
        this.rocket.y = -100;

        explosion.animations.add('boom');
        explosion.play('boom', 15, false, true)

        this.vibrate(300);
    },

    vibrate: function(duration) {
        if ("vibrate" in window.navigator) {
            window.navigator.vibrate(duration);
        }
    },

    handleDeviceLightEvent: function (event) {
        var value = event.value > this.maxValue ? this.maxValue : event.value;

        // Only start when it's really dark!
        if (!this.start && value < 10) {
            this.start = true;
            this.rocket.body.gravity.y = this.gravity;
        } else if (this.fuel > 0 && !this.win) {
            this.factor = value * -1;
            this.rocket.frameName = 'rocketon';
        } else {
            this.factor = 0;
        }
    },

    handleOrientation: function (ev) {
        this.speedX = parseInt(ev.gamma);
    },

    render: function() {
        //this.game.debug.body(this.platform, 32, 32);
    }
};
