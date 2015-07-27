;
(function() {
    'use strict';

    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        document.body.style.backgroundColor = "black";
        this.gameSize = {
            x: canvas.width,
            y: canvas.height
        };

        this.guns = [new Player(this, this.gameSize)];

        var sprite1 = new Sprite("#00FF00", [
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            [1, 3],
            [1, 4],
            [1, 5],
            [1, 7],
            [2, 0],
            [2, 2],
            [2, 3],
            [2, 4],
            [2, 5],
            [2, 6],
            [3, 1],
            [3, 2],
            [3, 4],
            [3, 5],
            [4, 2],
            [4, 3],
            [4, 4],
            [4, 5],
            [5, 2],
            [5, 3],
            [5, 4],
            [5, 5],
            [6, 2],
            [6, 3],
            [6, 4],
            [6, 5],
            [7, 1],
            [7, 2],
            [7, 4],
            [7, 5],
            [8, 0],
            [8, 2],
            [8, 3],
            [8, 4],
            [8, 5],
            [8, 6],
            [9, 3],
            [9, 4],
            [9, 5],
            [9, 7],
            [10, 1],
            [10, 2],
            [10, 3],
            [10, 4]
        ]);

        var sprite2 = new Sprite("#00FF00", [
            [0, 4],
            [0, 5],
            [0, 6],
            [1, 3],
            [1, 4],
            [2, 0],
            [2, 2],
            [2, 3],
            [2, 4],
            [2, 5],
            [2, 6],
            [3, 1],
            [3, 2],
            [3, 4],
            [3, 5],
            [3, 7],
            [4, 2],
            [4, 3],
            [4, 4],
            [4, 5],
            [4, 7],
            [5, 2],
            [5, 3],
            [5, 4],
            [5, 5],
            [6, 2],
            [6, 3],
            [6, 4],
            [6, 5],
            [6, 7],
            [7, 1],
            [7, 2],
            [7, 4],
            [7, 5],
            [7, 7],
            [8, 0],
            [8, 2],
            [8, 3],
            [8, 4],
            [8, 5],
            [8, 6],
            [9, 3],
            [9, 4],
            [10, 4],
            [10, 5],
            [10, 6]
        ]);

        this.invaders = [];
        for (var i = 0; i < 24; i++) {
            this.invaders.push(new Invader(this, this.gameSize, (i % 8), (i % 3), [sprite1, sprite2]));
        }

        this.bullets = [];
        this.own_bullets = [];

        var self = this;
        var tick = function() {
            self.update();
            screen.clearRect(0, 0, self.gameSize.x, self.gameSize.y);
            self.draw(screen);
            requestAnimationFrame(tick);
        };
        tick();
    };

    Game.prototype = {
        update: function() {

            var arrays = collide(this.own_bullets, this.bullets);
            this.own_bullets = arrays[0];
            this.bullets = arrays[1];

            var arrays = collide(this.bullets, this.guns);
            this.bullets = arrays[0];
            this.guns = arrays[1];

            var arrays = collide(this.own_bullets, this.invaders);
            this.own_bullets = arrays[0];
            this.invaders = arrays[1];

            var gameSize = this.gameSize;
            var is_inside_board = function(body) {
                return (body.center.x > 0.0 &&
                    body.center.x < gameSize.x &&
                    body.center.y > 0.0 &&
                    body.center.y < gameSize.y);
            };

            this.bullets = this.bullets.filter(is_inside_board);
            this.own_bullets = this.own_bullets.filter(is_inside_board);

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
            for (var i = 0; i < this.own_bullets.length; i++) {
                this.own_bullets[i].update();
            }
        },
        draw: function(screen) {
            for (var i = 0; i < this.guns.length; i++) {
                this.guns[i].draw(screen);
            }
            for (var i = 0; i < this.invaders.length; i++) {
                this.invaders[i].draw(screen);
            }
            for (var i = 0; i < this.bullets.length; i++) {
                this.bullets[i].draw(screen);
            }
            for (var i = 0; i < this.own_bullets.length; i++) {
                this.own_bullets[i].draw(screen);
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
                if (this.game.own_bullets.length == 0) {
                    var bullet = new Bullet({
                        x: this.center.x,
                        y: this.center.y - this.size.y / 2
                    }, {
                        x: 0,
                        y: -6
                    });
                    this.game.own_bullets.push(bullet);
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


    var Sprite = function(color, xy_data) {
        this.color = color;
        this.size = {
            x: 33,
            y: 24
        };
        this.xy_data = xy_data;

        var x_max = Number.MIN_VALUE;
        var y_max = Number.MIN_VALUE;
        for (var i = 0; i < this.xy_data.length; i++) {
            x_max = Math.max(x_max, this.xy_data[i][0]);
            y_max = Math.max(y_max, this.xy_data[i][1]);
        }

        this.pixels = [];
        var ux = this.size.x / (x_max + 1);
        var uy = this.size.y / (y_max + 1);
        for (var i = 0; i < this.xy_data.length; i++) {
            var x0 = ux * this.xy_data[i][0] - this.size.x / 2;
            var y0 = uy * this.xy_data[i][1] - this.size.y / 2;
            this.pixels.push([x0, y0, ux, uy]);
        }
    };

    Sprite.prototype = {
        draw: function(screen, x, y) {
            screen.beginPath();
            screen.strokeStyle = this.color;
            screen.fillStyle = this.color;
            for (var i = 0; i < this.pixels.length; i++) {
                screen.rect(x + this.pixels[i][0], y + this.pixels[i][1], this.pixels[i][2], this.pixels[i][3]);
            }
            screen.fill();
            screen.stroke();
            screen.closePath();
        }
    };


    var Invader = function(game, gameSize, i, j, sprites) {
        this.game = game;
        this.gameSize = gameSize;
        this.i_max = 0;
        this.i_min = 0;
        this.i = i;
        this.j = j;
        this.size = {
            x: 33,
            y: 24
        };
        this.center = {
            x: 66 + i * 66,
            y: 48 + j * 48
        };
        this.speed = {
            x: 6.0,
            y: 10.0
        };
        this.move_counter = 0;
        this.can_shoot = false;
        this.sprite_counter = 0;
        this.sprites = sprites;
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
                if (this.center.x > (this.gameSize.x - 66.0 - (this.i_max - this.i) * 66.0)) {
                    this.speed.x *= -1;
                    this.center.y += this.speed.y;
                }
                if (this.center.x < (66.0 + (this.i - this.i_min) * 66.0)) {
                    this.speed.x *= -1;
                    this.center.y += this.speed.y;
                }
                this.center.x += this.speed.x;
                this.sprite_counter++;
            }
            this.move_counter++;

            if (Math.random() > 0.997 && this.can_shoot) {
                this.shoot();
            }
        },
        draw: function(screen) {
            var i = this.sprite_counter % this.sprites.length;
            this.sprites[i].draw(screen, this.center.x, this.center.y);
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
