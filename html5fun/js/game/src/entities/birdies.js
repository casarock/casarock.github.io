var Bird = function(index, game, x) {
    this.game = game;
    x = x || this.game.world.width + 50;

    this.rangeYMin = this.game.world.height / 6;
    this.rangeYMax = this.game.world.height - 100;

    this.x = x;
    this.y = this.game.rnd.integerInRange(this.rangeYMin, this.rangeYMax);
    this.alive = true;
    this.bird = this.game.add.sprite(this.x, this.y, 'bird');
    this.bird.name = index;
    this.bird.scale.x *= -1;

    this.bird.animations.add('flap');
    this.bird.animations.play('flap', 10, true);
    this.bird.body.velocity.x = -200;
    this.scored = false;
};

Bird.prototype.update = function() {
    if(!this.scored && this.bird.x <= 100) {
        this.scored = true;
        this.game.score += 1;
    }

    if (this.bird.x <= -50) {
        this.bird.x = this.game.world.width + 50;
        this.bird.y = this.game.rnd.integerInRange(this.rangeYMin, this.rangeYMax);
        this.scored = false;
    }
};

Bird.prototype.getSprite = function() {
    return this.bird;
};