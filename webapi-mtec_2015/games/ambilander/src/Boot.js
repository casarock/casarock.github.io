BasicGame = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false

};

BasicGame.Boot = function (game) {
    this.game = game;
};

BasicGame.Boot.prototype = {

    init: function () {

        console.log("Booting");
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        this.game.orientated = true;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.minWidth = this.game.width / 2;
        this.scale.minHeight = this.game.height / 2;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        if (this.game.device.desktop)
        {
            this.scale.maxWidth = this.game.width;
            this.scale.maxHeight = this.game.height;
            this.scale.setScreenSize(true);
        }
        else
        {

            this.scale.maxWidth = this.game.width * 2.5;
            this.scale.maxHeight = this.game.height * 2.5;
            this.scale.forceOrientation(true, true);
            this.scale.setScreenSize(true);
        }

        window.setTimeout(this.startGame.bind(this), 1000);
    },

    preload: function () {

    },

    startGame: function() {
        this.game.state.start("Game");
    },

    create: function () {


    },

    gameResized: function (width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device or resizing the browser window.
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.
        console.log("resized");
    },

    enterIncorrectOrientation: function () {

        BasicGame.orientated = false;
        console.log("incorrect");
        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BasicGame.orientated = true;
        console.log("correct");
        document.getElementById('orientation').style.display = 'none';

    }

};
