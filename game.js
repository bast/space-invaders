;
(function() {
    'use strict';

    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        this.gameSize = {
            x: canvas.width,
            y: canvas.height
        };

        this.guns = [new Player(this, this.gameSize)];
        this.invaders = [];
        for (var i = 0; i < 24; i++) {
            this.invaders.push(new Invader(this, this.gameSize, (i % 8), (i % 3)));
        }
        this.bullets = [];

        var self = this;

        var tick = function() {
            self.update();
            self.draw(screen, self.gameSize);
            requestAnimationFrame(tick);
        };

        tick();
    };

    Game.prototype = {
        update: function() {

            var arrays = collide(this.bullets, this.guns);
            this.bullets = arrays[0];
            this.guns = arrays[1];

            var arrays = collide(this.bullets, this.invaders);
            this.bullets = arrays[0];
            this.invaders = arrays[1];

            var gameSize = this.gameSize;
            var is_inside_board = function(body) {
                return (body.center.x > 0.0 &&
                    body.center.x < gameSize.x &&
                    body.center.y > 0.0 &&
                    body.center.y < gameSize.y);
            };

            this.bullets = this.bullets.filter(is_inside_board);

            var i_min = Number.MAX_VALUE;
            var i_max = Number.MIN_VALUE;
            for (var i = 0; i < this.invaders.length; i++) {
                i_min = Math.min(i_min, this.invaders[i].i);
                i_max = Math.max(i_max, this.invaders[i].i);
            }
            for (var i = 0; i < this.invaders.length; i++) {
                this.invaders[i].i_min = i_min;
                this.invaders[i].i_max = i_max;
            }

            for (var i = 0; i < this.invaders.length; i++) {
                this.invaders[i].can_shoot = true;
                for (var j = 0; j < this.invaders.length; j++) {
                    if (this.invaders[i].i == this.invaders[j].i) {
                        if (this.invaders[i].j < this.invaders[j].j) {
                            this.invaders[i].can_shoot = false;
                            break;
                        }
                    }
                }
            }

            for (var i = 0; i < this.guns.length; i++) {
                this.guns[i].update();
            }
            for (var i = 0; i < this.invaders.length; i++) {
                this.invaders[i].update();
            }
            for (var i = 0; i < this.bullets.length; i++) {
                this.bullets[i].update();
            }
        },
        draw: function(screen, gameSize) {
            screen.clearRect(0, 0, gameSize.x, gameSize.y);
            for (var i = 0; i < this.guns.length; i++) {
                this.guns[i].draw(screen);
            }
            for (var i = 0; i < this.invaders.length; i++) {
                this.invaders[i].draw(screen);
            }
            for (var i = 0; i < this.bullets.length; i++) {
                this.bullets[i].draw(screen);
            }
        }
    };

    var Player = function(game, gameSize) {
        this.game = game;
        this.gameSize = gameSize;
        this.size = {
            x: 15,
            y: 15
        };
        this.center = {
            x: gameSize.x / 2,
            y: gameSize.y - this.size.x
        };
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {
        update: function() {
            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                // if check is to prevent player to move outside the board
                if ((this.center.x - 10) > 0) this.center.x -= 2;
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                // if check is to prevent player to move outside the board
                if ((this.center.x + 10) < this.gameSize.x) this.center.x += 2;
            }

            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
                var n = 0;
                for (var i = 0; i < this.game.bullets.length; i++) {
                    if (this.game.bullets[i].own) n++;
                }
                if (n == 0) {
                    var bullet = new Bullet({
                        x: this.center.x,
                        y: this.center.y - this.size.y / 2
                    }, {
                        x: 0,
                        y: -6
                    });
                    bullet.own = true;
                    this.game.bullets.push(bullet);
                }
            }
        },
        draw: function(screen) {
            screen.beginPath();
            screen.strokeStyle = "#000000";
            screen.fillStyle = "#00AA00";
            screen.rect(this.center.x - this.size.x / 2,
                this.center.y - this.size.y / 2,
                this.size.x,
                this.size.y);
            screen.fill();
            screen.stroke();
            screen.closePath();
        }
    };

    var Bullet = function(center, velocity) {
        this.size = {
            x: 3,
            y: 3
        };
        this.center = center;
        this.velocity = velocity;
        this.own = false;
    };

    Bullet.prototype = {
        update: function() {
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
        },
        draw: function(screen) {
            screen.beginPath();
            screen.strokeStyle = "#FF0000";
            screen.fillStyle = "#FF0000";
            screen.rect(this.center.x - this.size.x / 2,
                this.center.y - this.size.y / 2,
                this.size.x,
                this.size.y);
            screen.fill();
            screen.stroke();
            screen.closePath();
        }
    };

    var Invader = function(game, gameSize, i, j) {
        this.game = game;
        this.gameSize = gameSize;
        this.i_max = 0;
        this.i_min = 0;
        this.i = i;
        this.j = j;
        this.size = {
            x: 15,
            y: 15
        };
        this.center = {
            x: 30 + i * 30,
            y: 30 + j * 30
        };
        this.speed = {
            x: 3.0,
            y: 5.0
        };
        this.move_counter = 0;
        this.can_shoot = false;
    };

    Invader.prototype = {
        shoot: function() {
            var bullet = new Bullet({
                x: this.center.x,
                y: this.center.y + this.size.y / 2
            }, {
                x: 0.2 * (Math.random() - 0.5),
                y: 2
            });
            this.game.bullets.push(bullet);
        },
        update: function() {
            if (this.move_counter == 40) {
                this.move_counter = 0;
                if (this.center.x > (this.gameSize.x - 30.0 - (this.i_max - this.i) * 30.0)) {
                    this.speed.x *= -1;
                    this.center.y += this.speed.y;
                }
                if (this.center.x < (30.0 + (this.i - this.i_min) * 30.0)) {
                    this.speed.x *= -1;
                    this.center.y += this.speed.y;
                }
                this.center.x += this.speed.x;
            }
            this.move_counter++;

            if (Math.random() > 0.997 && this.can_shoot) {
                this.shoot();
            }
        },
        draw: function(screen) {
            screen.beginPath();
            screen.strokeStyle = "#000000";
            screen.fillStyle = "#000000";
            screen.rect(this.center.x - this.size.x / 2,
                this.center.y - this.size.y / 2,
                this.size.x,
                this.size.y);
            screen.fill();
            screen.stroke();
            screen.closePath();
        }
    };

    var Keyboarder = function() {
        var keyState = {};
        window.onkeydown = function(e) {
            keyState[e.keyCode] = true;
        };
        window.onkeyup = function(e) {
            keyState[e.keyCode] = false;
        };
        this.isDown = function(keyCode) {
            return keyState[keyCode] === true;
        };
        this.KEYS = {
            LEFT: 37,
            RIGHT: 39,
            SPACE: 32
        };
    };

    var colliding = function(b1, b2) {
        return !(b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };

    var deep_copy = function(array) {
        return array.map(function(x) {
            return x;
        });
    };


    // all items in array1 collide with all items in array2
    // all items which collide are pruned from the arrays
    var collide = function(array1, array2) {

        var array1_copy = deep_copy(array1);
        var array2_copy = deep_copy(array2);

        array1 = array1.filter(
            function(x) {
                for (var i = 0; i < array2_copy.length; i++) {
                    if (colliding(x, array2_copy[i])) {
                        return false;
                    }
                }
                return true;
            }
        );

        array2 = array2.filter(
            function(x) {
                for (var i = 0; i < array1_copy.length; i++) {
                    if (colliding(x, array1_copy[i])) {
                        return false;
                    }
                }
                return true;
            }
        );

        return [array1, array2];
    };

    window.onload = function() {
        new Game("screen");
    };
})();