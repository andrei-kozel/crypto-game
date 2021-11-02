// configure the game
// height, width, render type, game loop functions
let config = {
  width: 800,
  height: 500,
  type: Phaser.AUTO,
  scene: {
    preload: gamePreload,
    create: gameCreate,
    update: gameUpdate,
  },
};

// loading assets
function gamePreload() {}

// initial setup
function gameCreate() {}

// monitoring the inputs and telling the game how to
// update based on this inputs
function gameUpdate() {}

let game = new Phaser.Game(config);
