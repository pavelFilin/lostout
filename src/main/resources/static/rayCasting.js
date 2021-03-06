class Game {
    constructor(player, map) {
        this.FPS = 30;
        this.DISTANCE_ACTION = 0.8;
        this.NUMBER_ELEMENTS = 10;

        this.map = map;
        this.minimapObj = new MiniMap(map);
        this.player = player;
        this.lastLoop = new Date;
        this.gameObjects = [];
        this.menu = new Menu(camera.width, camera.height);

        this.initialize();

        this.movementAbility = false;
        this.isGameEnd = false;
    }

    initialize() {
        // this.gameObjects.push(new Enemy(new Bitmap("textures/guard.png", 64, 64), 2, 5, 100));
        bindKeys(this.player);

        this.minimapObj.visible = true;

        drawPlane.onclick = function (e) {
            if (game.menu.visible
                && e.clientX >= game.menu.width / 2 - game.menu.startTextureButton.width / 2
                && e.clientX <= game.menu.width / 2 + game.menu.startTextureButton.width / 2
                && e.clientY >= game.menu.height / 2 - game.menu.startTextureButton.height / 2
                && e.clientY <= game.menu.height / 2 + game.menu.startTextureButton.height / 2) {
                game.menu.visible = false;
                game.isGameEnd = false;
                game.player.hp = 100;
                game.movementAbility = true;
                for (let i = 0; i < game.NUMBER_ELEMENTS;) {
                    let x = Math.floor(Math.random() * 32) + 0.5;
                    let y = Math.floor(Math.random() * 32) + 0.5;
                    if (game.map.wallGrid[Math.floor(y)][Math.floor(x)] === 0) {
                        game.gameObjects.push(new Sprite(new Bitmap("textures/aquarium.png", 226, 445), x, y));
                        i++;
                    }
                }
            }
        };

        document.body.onkeypress = function (e) {
            if (e.key == 'm') {
                game.minimapObj.visible = !game.minimapObj.visible;
                if (game.minimapObj.visible) {
                    game.minimapObj.miniMapDoc.style.visibility = 'visible';
                } else {
                    game.minimapObj.miniMapDoc.style.visibility = 'hidden';
                }
            }
        }

    }

    toggleGameEnd() {
        game.isGameEnd = !game.isGameEnd;
        game.movementAbility = !game.movementAbility;
        game.menu.visible = true;
    }

    gameCycle() {

        var thisLoop = new Date;
        var elapsed = thisLoop - game.lastLoop;


        if (game.movementAbility) {
            game.player.move(elapsed);
        }

        game.player.rotate(elapsed);

        if (!game.isGameEnd) {
            game.reCalcDistanceForPlayer(game.gameObjects, game.player);
            game.takeSubjects();
            camera.render(game.player, map);
            game.player.weapon.draw(elapsed);

        } else {
            game.menu.drawEndMenu();
        }

        if (game.menu.visible) {
            game.menu.drawMenu();
        }

        if (game.minimapObj.visible) {
            game.minimapObj.drawMiniMap();
            game.minimapObj.drawPlayer(game.player);
        }

        var fps = 1000 / (thisLoop - game.lastLoop);
        game.lastLoop = thisLoop;
        game.printFPS(fps);

        setTimeout(game.gameCycle, (1000 / game.FPS) - elapsed / 10);

    }

    takeSubjects() {
        if (isPressF && game.gameObjects.length > 0) {
            game.player.weapon.isAttack = true;
            game.reCalcDistanceForPlayer(game.gameObjects, game.player);
            game.gameObjects.sort(function (b, a) {
                return Math.abs(a.distanceForPlayer) - Math.abs(b.distanceForPlayer);
            });
            let lastIndex = game.gameObjects.length - 1;
            if (game.gameObjects[lastIndex].distanceForPlayer < game.DISTANCE_ACTION) {
                game.gameObjects = game.gameObjects.splice(0, lastIndex);
                game.player.hp = (game.NUMBER_ELEMENTS - game.gameObjects.length) * player.hpMax / game.NUMBER_ELEMENTS;

                if (game.gameObjects.length == 0 && !game.isGameEnd) {
                    game.toggleGameEnd();
                }

            }
        }
    }

    reCalcDistanceForPlayer(gameObjects, player) {
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].calculateDistancesToSprites(player);
        }
    }


    printFPS(fps) {
        camera.ctx.save;
        camera.ctx.fillStyle = "black";
        camera.ctx.font = "40px Tahoma";
        camera.ctx.textAlign = "start";
        camera.ctx.fillText(Math.round(fps), 0, 40);
        camera.ctx.restore();
    }
}


class Player {
    constructor(x, y, direction, rotation, weapon) {
        this.weapon = weapon;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.mouseMoveX = 0;
        this.speed = 0;
        this.rotation = rotation;
        this.moveSpeed = 0.0035;
        this.rotationSpeed = Math.PI / 1800;
        this.mouseRatationSpeed = 0.25 * Math.PI / 1800;
        this.hp = 100;
        this.hpMax = 100;
    }

    move(elapsedTime) {
        var moveStep = this.speed * this.moveSpeed * elapsedTime;

        var newX = this.x + Math.cos(this.rotation) * moveStep;
        var newY = this.y + Math.sin(this.rotation) * moveStep;

        if (isCollision(newX, newY)) {
            return;
        }

        if ((newX != this.x || newY != this.y)) {
            if (Math.abs(this.weapon.y) > this.weapon.shift || this.weapon.y > 0) {
                this.weapon.shiftDirection = -this.weapon.shiftDirection;
            }

            this.weapon.y -= this.weapon.shiftDirection * this.moveSpeed * elapsedTime;
        }

        this.x = newX;
        this.y = newY;


    }

    rotate(elapsedTime) {
        this.rotation += this.direction * this.rotationSpeed * elapsedTime;

        this.rotation += this.mouseMoveX * this.mouseRatationSpeed * elapsedTime;
        this.mouseMoveX = 0;
    }
}

class Map {
    constructor(size) {
        this.size = size;
        this.objects = [];
        this.wallTexture = [
            new Bitmap('textures/bigWall3.png', 500, 500),
            new Bitmap('textures/bluestone.png', 64, 64),
            new Bitmap('textures/colorstone.png', 64, 64),
            new Bitmap('textures/eagle.png', 64, 64),
            new Bitmap('textures/greystone.png', 64, 64),
            new Bitmap('textures/mossy.png', 64, 64),
            new Bitmap('textures/purplestone.png', 64, 64),
            new Bitmap('textures/redbrick.png', 64, 64),
            new Bitmap('textures/wood.png', 64, 64),
        ];

        this.wallGrid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 8, 8, 4, 8, 8, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 8, 8, 8, 4, 8, 8, 0, 0, 0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 5, 5, 5, 5, 6, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 6, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 8, 0, 0, 8, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 8, 0, 0, 2, 4, 2, 9, 9, 9, 9, 9, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 8, 0, 0, 4, 1, 4, 0, 0, 9, 9, 9, 9, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 4, 0, 0, 2, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 6, 6, 6, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 6, 1, 1, 1, 1, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 6, 5, 5, 5, 5, 5, 6, 0, 0, 8, 8, 9, 9, 9, 9, 0, 2, 4, 2, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 6, 1],
            [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 9, 0, 0, 0, 3, 6, 6, 6, 0, 2, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 5, 0, 0, 0, 1],
            [1, 0, 0, 9, 9, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 1],
            [1, 0, 0, 0, 9, 9, 0, 5, 0, 0, 0, 0, 2, 0, 0, 0, 3, 3, 1, 1, 1, 0, 0, 0, 5, 0, 0, 5, 6, 0, 0, 1],
            [1, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 9, 6, 0, 0, 1],
            [1, 0, 8, 0, 0, 0, 0, 0, 0, 9, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 0, 0, 1, 0, 0, 0, 5, 5, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }


    cast(point, angle, range) {
        var self = this;
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var oneRay = {x: point.x, y: point.y, height: 0, distance: 0}


        while (oneRay.distance < range) {
            if (oneRay.height > 0) {
                return oneRay;
            }
            oneRay = ray(oneRay);
        }

        return oneRay;

        function ray(origin) {
            var stepX = step(sin, cos, origin.x, origin.y);
            var stepY = step(cos, sin, origin.y, origin.x, true);
            var nextStep = stepX.length2 < stepY.length2
                ? inspect(stepX, 1, 0, origin.distance, stepX.y)
                : inspect(stepY, 0, 1, origin.distance, stepY.x);

            return nextStep;

            // return [origin].concat(ray(nextStep));
        }

        function step(rise, run, x, y, inverted) {
            var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            var dy = dx * (rise / run);
            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                length2: dx * dx + dy * dy,
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
            if (shiftX) {
                step.shading = cos < 0 ? 2 : 0;
            }
            else {
                step.shading = sin < 0 ? 2 : 1;
            }

            step.offset = offset - Math.floor(offset);
            return step;
        }
    };
}


class MiniMap {
    constructor(map) {
        this.visible = false;
        this.map = map;
        this.mapWidth = map.wallGrid[0].length;
        this.mapHeight = map.wallGrid.length;
        this.miniMapScale = 6;
        this.miniMapDoc = document.getElementById("minimap");
        this.miniMapDoc.style.left = -this.mapWidth * this.miniMapScale - 15 + "px"

        this.ctx = this.miniMapDoc.getContext('2d');
    }

    drawMiniMap() {
        this.miniMapDoc.width = this.mapWidth * this.miniMapScale;
        this.miniMapDoc.height = this.mapHeight * this.miniMapScale;
        this.miniMapDoc.style.width = (this.mapWidth * this.miniMapScale) + 'px';
        this.miniMapDoc.style.height = (this.mapHeight * this.miniMapScale) + 'px';


        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                var wall = map.wallGrid[y][x];
                if (wall > 0) {
                    this.ctx.fillStyle = "#6c6fb7";
                    this.ctx.globalAlpha = 0.5;
                    this.ctx.fillRect(
                        x * this.miniMapScale,
                        y * this.miniMapScale,
                        this.miniMapScale, this.miniMapScale
                    );
                }
            }
        }
    }

    drawPlayer(player) {
        this.ctx.fillStyle = "#47dc31";
        this.ctx.fillRect(player.x * this.miniMapScale - 2, player.y * this.miniMapScale - 2, 4, 4);

        this.ctx.beginPath();
        this.ctx.moveTo(player.x * this.miniMapScale, player.y * this.miniMapScale);
        this.ctx.lineTo((player.x + Math.cos(player.rotation) * 4) * this.miniMapScale, (player.y + Math.sin(player.rotation) * 4) * this.miniMapScale);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

class Weapon {
    constructor(name, bitmap, damage, screenWidth, screenHeight, ctx) {
        this.size = 0.4;
        this.shift = 40;
        this.shiftDirection = 15;
        this.name = name;
        this.bitmap = bitmap;
        this.damage = damage;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.x = 0;
        this.y = 0;
        this.isAttack = false;
        this.timeAnimation = 600;
        this.elapsed = 0;
        this.ctx = ctx;
        this.angle = 0;
        this.angleSpeed = 0.07;
    }

    draw(gameTime) {
        let left = this.screenWidth - this.bitmap.width * this.size - this.x;
        let top = this.screenHeight - this.bitmap.height * this.size - this.y;
        if (!this.isAttack) {
            this.ctx.drawImage(this.bitmap.image, left, top, this.bitmap.width * this.size, this.bitmap.height * this.size);
        } else {
            this.drawAttack(gameTime, left, top);
        }

    }

    drawAttack(gametime, left, top) {
        this.elapsed += gametime;
        if (this.elapsed < this.timeAnimation) {
            if (this.elapsed < this.timeAnimation / 2) {
                this.angle += this.angleSpeed;
            } else {
                this.angle -= this.angleSpeed;
            }
            this.ctx.save();
            this.ctx.translate(left + this.bitmap.width * this.size, top + this.bitmap.height * this.size);
            this.ctx.rotate(-this.angle);
            this.ctx.drawImage(this.bitmap.image, -this.bitmap.width * this.size, -this.bitmap.height * this.size, this.bitmap.width * this.size, this.bitmap.height * this.size);
            this.ctx.restore();
        } else {
            this.isAttack = !this.isAttack;
            this.elapsed = 0;
            this.angle = 0;
            this.draw(gametime);
        }
    }
}


function bindKeys(player) {
    document.onkeydown = function (e) {
        e = e || window.event;
        // Which key was pressed?
        switch (e.keyCode) {
            // Up
            case 87:
            case 38: {
                player.speed = 1;
            }
                break;
            // Down
            case 83:
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
            case 70: {
                isPressF = 1;
            }
                break;
        }
    }

    document.onkeyup = function (e) {
        e = e || window.event;
        switch (e.keyCode) {
            case 38:
            case 40:
            case 83:
            case 87: {
                player.speed = 0;
            }
                break;
            case 37:
            case 39: {
                player.direction = 0;
            }
                break;
            case 70: {
                isPressF = 0;
            }
                break;

        }
    }

    document.onmousemove = function (e) {
        var x = (e.movementX || e.mozMovementX || e.webkitMovementX || 0);
        player.mouseMoveX = x;
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
    constructor(player, canvas, resolution, fov) {
        this.player = player;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.resolution = resolution;
        this.spacing = this.width / resolution;
        this.fov = fov;
        this.range = 16;
        this.hud = new Hud(this.player, this.width, this.height, this.ctx);
    }

    project(height, angle, distance) {
        var z = distance * Math.cos(angle);
        var wallHeight = this.height / z;
        var bottom = this.height / 2 * (1 + 1 / z);
        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }

    projectSprite(height, angle, distance) {
        var z = distance;
        var wallHeight = this.height / z;
        var bottom = this.height / 2 * (1 + 1 / z);
        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }

    render(player, map) {
        this.drawFloor();
        this.drawCeiling();

        var hitMap = this.drawColumns(player, map);

        this.drawSprites(player, game.gameObjects, hitMap);

        this.hud.drawHud();

    }

    drawSprites(player, gameObjects, hitmap) {
        gameObjects.sort(function (b, a) {
            return Math.abs(a.distanceForPlayer) - Math.abs(b.distanceForPlayer);
        });

        for (let i = 0; i < gameObjects.length; i++) {
            var sprite = gameObjects[i];
            var img = sprite.bitmap;
            var dx = sprite.x - player.x;
            var dy = sprite.y - player.y;

            var angle = Math.atan2(dy, dx) - player.rotation % (Math.PI * 2);


            if (angle < -Math.PI) angle += 2 * Math.PI;
            if (angle >= Math.PI) angle -= 2 * Math.PI;
            if (angle > -Math.PI * 0.5 && angle < Math.PI * 0.5) {
                var xLeft = (Math.tan(angle) + 0.5) * this.resolution * this.spacing;

                var textureX = xLeft;
                var distSquared = dx * dx + dy * dy;
                var dist = Math.sqrt(distSquared);
                var picture = this.projectSprite(1, angle, dist);
                var widthImg = img.width * (picture.height / img.height);
                var left = 0;
                var leftT = false;
                var rightT = false;
                var right = 0;
                let colBegin = Math.floor(xLeft);

                var xTextureCenter = xLeft + widthImg / 2;
                var t = img.width / 2;
                var w = img.width / widthImg;
                var wb = w;
                this.ctx.save();
                this.ctx.globalAlpha = 1;
                for (let r = widthImg / 2; r < widthImg; r++) {
                    if (dist < hitmap[Math.floor((xLeft + r) / this.spacing)]) {
                        this.ctx.drawImage(img.image, Math.floor(w) + img.width / 2, 0, 1, img.height, r + xLeft, picture.top, this.spacing, picture.height);
                    }
                    w += wb;
                }


                this.ctx.globalAlpha = 1;
                for (let r = 0; r < widthImg / 2; r++) {
                    if (dist < hitmap[Math.floor((xLeft - r + widthImg / 2) / this.spacing)]) {
                        this.ctx.drawImage(img.image, Math.floor(w), 0, 1, img.height, xLeft - r + widthImg / 2, picture.top, 1, picture.height);
                    }
                    w -= wb;
                }
                this.ctx.restore();
            }
        }
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
        var hitMap = [];
        this.ctx.save();
        var allObjects = [];
        for (var column = 0; column < this.resolution; column++) {
            var x = column / this.resolution - 0.5;
            var angle = Math.atan2(x, this.fov);

            var ray = map.cast(player, player.rotation + angle, this.range);
            this.drawColumn(column, ray, angle, map, hitMap);
        }
        this.ctx.restore();
        return hitMap;
    }

    drawColumn(column, ray, angle, map, hitMap) {
        var ctx = this.ctx;
        var texture = map.wallTexture[ray.height - 1];
        var left = Math.floor(column * this.spacing);
        var width = Math.ceil(this.spacing);
        hitMap.push(ray.distance);
        if (ray.height > 0) {
            var textureX = Math.floor(texture.width * ray.offset);
            var wall = this.project(ray.height, angle, ray.distance);
            ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);
        }
    }
}

class Sprite {
    constructor(bitmap, x, y) {
        this.bitmap = bitmap;
        this.x = x;
        this.y = y;
        this.distanceForPlayer = 0;
    }

    calculateDistancesToSprites(player) {
        this.distanceForPlayer = Math.sqrt(Math.pow((player.x - this.x), 2) + Math.pow((player.y - this.y), 2))
    }
}

class Enemy extends Sprite {
    constructor(bitmap, x, y, hp) {
        super(bitmap, x, y);
        this.hp = hp;
    }
}

class Hud {
    constructor(player, width, height, ctx) {
        this.player = player;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
    }

    drawHud() {
        this.drawCrosshair();
        this.drawHpBar();
    }

    drawCrosshair() {
        let xCross = this.width / 2 - crosshairTexture.width / 2;
        let yCross = this.height * 5 / 9 - crosshairTexture.height / 2;
        let crosshairSize = 0.6;
        this.ctx.globalAlpha = 0.3;
        this.ctx.drawImage(crosshairTexture.image, xCross, yCross, crosshairTexture.width * crosshairSize, crosshairTexture.height * crosshairSize);
        this.ctx.globalAlpha = 1;
    }

    drawHpBar() {

        var hpBar = {
            x: this.width / 30,
            y: this.width * 7 / 10,
            width: 200,
            height: 20
        };

        this.ctx.fillStyle = "Red";
        this.ctx.font = "18px sans-serif";
        if (player.hp == player.hpMax) {
            this.ctx.fillText("Life " + player.hp, hpBar.x, hpBar.y - 10);
        } else {
            this.ctx.fillText("Life " + player.hp + "/" + player.hpMax, hpBar.x, hpBar.y - 10);
        }

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(hpBar.x, hpBar.y, hpBar.width, hpBar.height);

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(hpBar.x, hpBar.y, hpBar.width * player.hp / 100, hpBar.height);
    }


}

class Menu {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.visible = true;
        this.startTextureButton = new Bitmap("textures/startButton.png", 339, 107);
    }

    drawMenu() {
        this.drawStartButton();
    }

    drawStartButton() {
        camera.ctx.drawImage(this.startTextureButton.image, this.width / 2 - this.startTextureButton.width / 2, this.height / 2 - this.startTextureButton.height / 2)
    }

    drawEndMenu() {
        let ctx = camera.ctx;
        ctx.fillStyle = "Red";
        ctx.font = "80px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", camera.width / 2, 100);
    }
}

var isPressF = 0;
var drawPlane = document.getElementById('screen-render');


drawPlane.height = parseInt(drawPlane.style.height);
drawPlane.width = parseInt(drawPlane.style.width);

var map = new Map(32);
var camera = new Camera(player, drawPlane, 400, 0.8);

var player = new Player(10, 6, 0, 0, new Weapon("Dragon hook", new Bitmap("textures/dragonhook.png", 726, 868), 20, camera.width, camera.height, camera.ctx));
var game = new Game(player, map);

var crosshairTexture = new Bitmap("textures/crosshair.png", 76, 76);

document.body.ondblclick = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;


game.gameCycle();
