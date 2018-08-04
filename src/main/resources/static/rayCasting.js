class Game {
    constructor(player, map) {
        this.minimapObj = new MiniMap(map);
        this.player = player;
        this.lastLoop = new Date;

        this.initialize();
    }

    initialize() {
        bindKeys(this.player);
    }

    gameCycle() {
        var thisLoop = new Date;

        game.player.move();
        camera.render(this.player, map);
        game.minimapObj.drawMiniMap(game.player);

        var fps = 1000 / (thisLoop - game.lastLoop);
        game.lastLoop = thisLoop;
        game.printFPS(fps);

        setTimeout(game.gameCycle, 1000 / 30);
    }

    printFPS(fps) {
        camera.ctx.save;
        camera.ctx.fillStyle = "black";
        camera.ctx.font = "50px arial";
        camera.ctx.fillText(Math.round(fps), 20, 70);
        camera.ctx.restore();
    }
}

class Player {
    constructor(x, y, direction, rotation) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 0;
        this.rotation = rotation;
        this.moveSpeed = 0.18;
        this.rotationSpeed = 6 * Math.PI / 180;
    }

    move() {
        var moveStep = this.speed * this.moveSpeed;

        this.rotation += this.direction * this.rotationSpeed;

        var newX = this.x + Math.cos(this.rotation) * moveStep;
        var newY = this.y + Math.sin(this.rotation) * moveStep;

        if (isCollision(newX, newY)) {
            return;
        }

        this.x = newX;
        this.y = newY;
    }
}

class Map {
    constructor(size) {
        this.size = size;
        this.wallTexture = new Bitmap('textures/wall.png', 64, 64);
        this.wallGrid = [
            [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }

    cast(point, angle, range) {
        var self = this;
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var noWall = {length2: Infinity};

        return ray({x: point.x, y: point.y, height: 0, distance: 0});

        function ray(origin) {
            var stepX = step(sin, cos, origin.x, origin.y);
            var stepY = step(cos, sin, origin.y, origin.x, true);
            var nextStep = stepX.length2 < stepY.length2
                ? inspect(stepX, 1, 0, origin.distance, stepX.y)
                : inspect(stepY, 0, 1, origin.distance, stepY.x);

            if (nextStep.distance > range) return [origin];
            return [origin].concat(ray(nextStep));
        }

        function step(rise, run, x, y, inverted) {
            if (run === 0) return noWall;
            var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            var dy = dx * (rise / run);
            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                length2: dx * dx + dy * dy
            };
        }

        function inspect(step, shiftX, shiftY, distance, offset) {
            var dx = cos < 0 ? shiftX : 0;
            var dy = sin < 0 ? shiftY : 0;
            var tempX = Math.floor(step.x - dx);
            var tempY = Math.floor(step.y - dy);
            if (tempX >= 0 && tempY >= 0 && tempX < 32 && tempY < 32) {
                step.height = self.wallGrid[tempY][tempX];
            }
            step.distance = distance + Math.sqrt(step.length2);
            if (shiftX) step.shading = cos < 0 ? 2 : 0;
            else step.shading = sin < 0 ? 2 : 1;
            step.offset = offset - Math.floor(offset);
            return step;
        }
    };
}


class MiniMap {
    constructor(map) {
        this.map = map;
        this.mapWidth = map.wallGrid[0].length;
        this.mapHeight = map.wallGrid.length;
        this.miniMapScale = 8;
    }

    drawMiniMap(player) {
        var miniMapDoc = document.getElementById("minimap");
        miniMapDoc.width = this.mapWidth * this.miniMapScale;
        miniMapDoc.height = this.mapHeight * this.miniMapScale;
        // Resize the canvas CSS dimensions
        miniMapDoc.style.width = (this.mapWidth * this.miniMapScale) + 'px';
        miniMapDoc.style.height = (this.mapHeight * this.miniMapScale) + 'px';

        var ctx = miniMapDoc.getContext('2d');
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                var wall = map.wallGrid[y][x];
                if (wall > 0) {
                    ctx.fillStyle = 'rgb(200,200,200)';
                    ctx.fillRect(
                        x * this.miniMapScale,
                        y * this.miniMapScale,
                        this.miniMapScale, this.miniMapScale
                    );
                }
            }
        }

        ctx.fillRect(player.x * this.miniMapScale - 2, player.y * this.miniMapScale - 2, 4, 4);

        ctx.beginPath();
        ctx.moveTo(player.x * this.miniMapScale, player.y * this.miniMapScale);
        ctx.lineTo((player.x + Math.cos(player.rotation) * 4) * this.miniMapScale, (player.y + Math.sin(player.rotation) * 4) * this.miniMapScale);
        ctx.closePath();
        ctx.stroke();
    }
}


function bindKeys(player) {
    document.onkeydown = function (e) {
        e = e || window.event;
        // Which key was pressed?
        switch (e.keyCode) {
            // Up
            case 38: {
                player.speed = 1;
            }
                break;
            // Down
            case 40: {
                player.speed = -1;
            }
                break;
            // Left
            case 37: {
                player.direction = -1;
            }
                break;
            // Right, rotate player right
            case 39: {
                player.direction = 1;
            }
                break;
        }
    }

    document.onkeyup = function (e) {
        e = e || window.event;
        switch (e.keyCode) {
            case 38:
            case 40: {
                player.speed = 0;
            }
                break;
            case 37:
            case 39: {
                player.direction = 0;
            }
                break;
        }
    }
}

function isCollision(x, y) {
    return (map.wallGrid[Math.floor(y)][Math.floor(x)] != 0);
}

class Bitmap {
    constructor(src, width, height) {
        this.image = new Image();
        this.image.src = src;
        this.width = width;
        this.height = height;
    }
}

class Camera {
    constructor(player, canvas, resolution, focalLength) {
        this.player = player;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.resolution = resolution;
        this.spacing = this.width / resolution;
        this.focalLength = focalLength || 0.8;
        this.range = 16;
        this.lightRange = 5;
        this.scale = (this.width + this.height) / 1200;
    }

    project(height, angle, distance) {
        var z = distance * Math.cos(angle);
        var wallHeight = this.height * height / z;
        var bottom = this.height / 2 * (1 + 1 / z);
        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }

    render(player, map) {
        this.drawFloor();
        this.drawCeiling();
        this.drawColumns(player, map);
    }

    drawFloor() {
        this.ctx.save();
        this.ctx.fillStyle = '#647985';
        this.ctx.globalAlpha = 1;
        this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
        this.ctx.restore();
    }

    drawCeiling() {
        this.ctx.save();
        this.ctx.fillStyle = "#e4e1e5";
        this.ctx.globalAlpha = 1;
        this.ctx.fillRect(0, 0, this.width, this.height * 0.5);
        this.ctx.restore();
    }


    drawColumns(player, map) {
        this.ctx.save();
        for (var column = 0; column < this.resolution; column++) {
            var x = column / this.resolution - 0.5;
            var angle = Math.atan2(x, this.focalLength);
            var ray = map.cast(player, player.rotation + angle, this.range);
            this.drawColumn(column, ray, angle, map);
        }
        this.ctx.restore();
    }

    drawColumn(column, ray, angle, map) {
        var ctx = this.ctx;
        var texture = map.wallTexture;
        var left = Math.floor(column * this.spacing);
        var width = Math.ceil(this.spacing);
        var hit = -1;

        while (++hit < ray.length && ray[hit].height <= 0) ;

        for (var s = ray.length - 1; s >= 0; s--) {
            var step = ray[s];

            if (s === hit) {
                var textureX = Math.floor(texture.width * step.offset);
                var wall = this.project(step.height, angle, step.distance);

                ctx.globalAlpha = 1;
                ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);
            }
        }

    }

}

var drawPlane = document.getElementById('screen-render');
drawPlane.height = parseInt(drawPlane.style.height);
drawPlane.width = parseInt(drawPlane.style.width);
var map = new Map(32)
var player = new Player(10, 6, 0, 0);
var camera = new Camera(player, drawPlane, 320, 0.8);
var game = new Game(player, map);

game.gameCycle();
