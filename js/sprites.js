define('sprites', [], function () {
    'use strict';

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

    return {
        sprite1: sprite1,
        sprite2: sprite2
    };
});
