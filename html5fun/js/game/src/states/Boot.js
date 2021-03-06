TubyFlaps = {};

TubyFlaps.Boot = function (game) {
};

TubyFlaps.Boot.prototype = {
    preload: function () {
    },

    create: function () {
        this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            //  If you have any desktop specific settings, they can go in here
            this.game.stage.scale.pageAlignHorizontally = true;
        }
        else {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.forceLandscape = true;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.setScreenSize(true);
        }

        this.game.state.start('Preloader');
    }
};
