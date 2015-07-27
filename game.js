;
(function() {
    'use strict';

    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var gameSize = {
            x: canvas.width,
            y: canvas.height
        };

        this.bodies = []
        this.bodies.push(new Player(this, gameSize));
        for (var i = 0; i < 24; i++) {
            this.bodies.push(new Invader(this, gameSize, (i % 8), (i % 3)));
        }

        var self = this;

        var tick = function() {
            self.update();
            self.draw(screen, gameSize);
            requestAnimationFrame(tick);
        };

        tick();
    };

    Game.prototype = {
        update: function() {
            var bodies = this.bodies;

            var notCollidingWithAnything = function(b1) {
                return bodies.filter(function(b2) {
                    return colliding(b1, b2);
                }).length === 0;
            };

            this.bodies = this.bodies.filter(notCollidingWithAnything);
            this.bodies = this.bodies.filter(
                function(value) {
                    return (inside_board(value, 0, 310, 0, 310)); // FIXME hardcoded
                }
            );

            var i_min = Number.MAX_VALUE;
            var i_max = Number.MIN_VALUE;
            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i] instanceof Invader) {
                    i_min = Math.min(i_min, this.bodies[i].i);
                    i_max = Math.max(i_max, this.bodies[i].i);
                }
            }
            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i] instanceof Invader) {
                    this.bodies[i].i_min = i_min;
                    this.bodies[i].i_max = i_max;
                }
            }

            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            }
        },
        draw: function(screen, gameSize) {
            screen.clearRect(0, 0, gameSize.x, gameSize.y);
            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].draw(screen);
            }
        },
        invadersBelow: function(invader) {
            return this.bodies.filter(function(b) {
                return b instanceof Invader &&
                    b.center.y > invader.center.y &&
                    b.center.x - invader.center.x < invader.size.x;
            }).length > 0;
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
                for (var i = 0; i < this.game.bodies.length; i++) {
                    if (this.game.bodies[i] instanceof Bullet) {
                        if (this.game.bodies[i].own) n++;
                    }
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
                    this.game.bodies.push(bullet);
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
            this.game.bodies.push(bullet);
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

            if (Math.random() > 0.997 && !this.game.invadersBelow(this)) {
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
        return !(b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };

    var inside_board = function(body, x_min, x_max, y_min, y_max) {
        return (body.center.x > x_min &&
            body.center.x < x_max &&
            body.center.y > y_min &&
            body.center.y < y_max);
    };

    window.onload = function() {
        new Game("screen");
    };
})();
