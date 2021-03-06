define('sprites', [], function() {
    'use strict';

    var Sprite = function(color, size, xy_data) {
        this.color = color;
        this.size = size;
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

    var sprite1a = new Sprite("#CCCCCC", {
        x: 33,
        y: 24
    }, [
        [0, 3],
        [0, 4],
        [0, 7],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 6],
        [2, 1],
        [2, 2],
        [2, 4],
        [2, 5],
        [2, 7],
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
        [3, 6],
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 3],
        [4, 4],
        [4, 6],
        [5, 1],
        [5, 2],
        [5, 4],
        [5, 5],
        [5, 7],
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 6],
        [7, 3],
        [7, 4],
        [7, 7]
    ]);

    var sprite1b = new Sprite("#CCCCCC", {
        x: 33,
        y: 24
    }, [
        [0, 3],
        [0, 4],
        [0, 6],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 7],
        [2, 1],
        [2, 2],
        [2, 4],
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
        [3, 5],
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 3],
        [4, 4],
        [4, 5],
        [5, 1],
        [5, 2],
        [5, 4],
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 5],
        [6, 7],
        [7, 3],
        [7, 4],
        [7, 6]
    ]);

    var sprite2a = new Sprite("#CCCCCC", {
        x: 33,
        y: 24
    }, [
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

    var sprite2b = new Sprite("#CCCCCC", {
        x: 33,
        y: 24
    }, [
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

    var sprite3a = new Sprite("#CCCCCC", {
        x: 33,
        y: 24
    }, [
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 7],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 7],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
        [2, 6],
        [3, 1],
        [3, 2],
        [3, 4],
        [3, 5],
        [3, 6],
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 4],
        [4, 5],
        [5, 0],
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],
        [5, 4],
        [5, 6],
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 4],
        [6, 6],
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 4],
        [7, 5],
        [8, 1],
        [8, 2],
        [8, 4],
        [8, 5],
        [8, 6],
        [9, 1],
        [9, 2],
        [9, 3],
        [9, 4],
        [9, 6],
        [10, 1],
        [10, 2],
        [10, 3],
        [10, 4],
        [10, 7],
        [11, 2],
        [11, 3],
        [11, 4],
        [11, 7]
    ]);

    var sprite3b = new Sprite("#CCCCCC", {
        x: 33,
        y: 24
    }, [
        [0, 2],
        [0, 3],
        [0, 4],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 6],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
        [2, 5],
        [2, 6],
        [2, 7],
        [3, 1],
        [3, 2],
        [3, 4],
        [3, 5],
        [3, 7],
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 4],
        [4, 5],
        [5, 0],
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],
        [5, 4],
        [5, 6],
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 4],
        [6, 6],
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 4],
        [7, 5],
        [8, 1],
        [8, 2],
        [8, 4],
        [8, 5],
        [8, 7],
        [9, 1],
        [9, 2],
        [9, 3],
        [9, 4],
        [9, 5],
        [9, 6],
        [9, 7],
        [10, 1],
        [10, 2],
        [10, 3],
        [10, 4],
        [10, 6],
        [11, 2],
        [11, 3],
        [11, 4]
    ]);

    var gun = new Sprite("#00FF00", {
        x: 40,
        y: 24
    }, [
        [0, 3],
        [0, 4],
        [0, 5],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [2, 2],
        [2, 3],
        [2, 4],
        [2, 5],
        [3, 2],
        [3, 3],
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
        [6, 1],
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 5],
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [8, 1],
        [8, 2],
        [8, 3],
        [8, 4],
        [8, 5],
        [9, 2],
        [9, 3],
        [9, 4],
        [9, 5],
        [10, 2],
        [10, 3],
        [10, 4],
        [10, 5],
        [11, 2],
        [11, 3],
        [11, 4],
        [11, 5],
        [12, 2],
        [12, 3],
        [12, 4],
        [12, 5],
        [13, 2],
        [13, 3],
        [13, 4],
        [13, 5],
        [14, 3],
        [14, 4],
        [14, 5]
    ]);

    var bullet1 = new Sprite("#FF9999", {
        x: 3,
        y: 7
    }, [
        [0, 0],
        [0, 4],
        [1, 1],
        [1, 3],
        [1, 5],
        [2, 2],
        [2, 6]
    ]);

    var bullet2 = new Sprite("#FF9999", {
        x: 6,
        y: 14
    }, [
        [0, 2],
        [0, 6],
        [1, 1],
        [1, 3],
        [1, 5],
        [2, 0],
        [2, 4]
    ]);

    return {
        sprite1a: sprite1a,
        sprite1b: sprite1b,
        sprite2a: sprite2a,
        sprite2b: sprite2b,
        sprite3a: sprite3a,
        sprite3b: sprite3b,
        bullet1: bullet1,
        bullet2: bullet2,
        gun: gun
    };
});