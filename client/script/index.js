// configure the game
// height, width, render type, game loop functions
let cursors;
let knight;
let crates;
let coinTimer;
let score = 0;
let scoreText;
let timeLeft = 60;
let timeLeftText;
let timeLeftTimer;
let gameOver = false;
let coinSent = false;

let config = {
  width: 800,
  height: 500,
  type: Phaser.AUTO,
  scene: {
    preload: gamePreload,
    create: gameCreate,
    update: gameUpdate,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
};

// loading assets
function gamePreload() {
  this.load.image("knight", "./assets/knight.png");
  this.load.image("crate", "./assets/crate.png");
  this.load.image("background", "./assets/background.png");
  this.load.image("coin", "./assets/bitcoin.png");

  // load run animation
  this.load.image("run_frame_1", "./assets/knight/run/Run (1).png");
  this.load.image("run_frame_2", "./assets/knight/run/Run (2).png");
  this.load.image("run_frame_3", "./assets/knight/run/Run (3).png");
  this.load.image("run_frame_4", "./assets/knight/run/Run (4).png");
  this.load.image("run_frame_5", "./assets/knight/run/Run (5).png");
  this.load.image("run_frame_6", "./assets/knight/run/Run (6).png");
  this.load.image("run_frame_7", "./assets/knight/run/Run (7).png");
  this.load.image("run_frame_8", "./assets/knight/run/Run (8).png");
  this.load.image("run_frame_9", "./assets/knight/run/Run (9).png");
  this.load.image("run_frame_10", "./assets/knight/run/Run (10).png");

  // load idle animation
  this.load.image("idle_frame_1", "./assets/knight/idle/Idle (1).png");
  this.load.image("idle_frame_2", "./assets/knight/idle/Idle (2).png");
  this.load.image("idle_frame_3", "./assets/knight/idle/Idle (3).png");
  this.load.image("idle_frame_4", "./assets/knight/idle/Idle (4).png");
  this.load.image("idle_frame_5", "./assets/knight/idle/Idle (5).png");
  this.load.image("idle_frame_6", "./assets/knight/idle/Idle (6).png");
  this.load.image("idle_frame_7", "./assets/knight/idle/Idle (7).png");
  this.load.image("idle_frame_8", "./assets/knight/idle/Idle (8).png");
  this.load.image("idle_frame_9", "./assets/knight/idle/Idle (9).png");
  this.load.image("idle_frame_10", "./assets/knight/idle/Idle (10).png");
}

// initial setup
function gameCreate() {
  // create background
  this.add.image(300, 200, "background");

  // create the knight
  knight = this.physics.add.sprite(100, 100, "knight");
  knight.body.setSize(400, 600, 10, 0);
  knight.scaleX = 0.2;
  knight.scaleY = knight.scaleX;

  // create the crates
  // floor
  crates = this.physics.add.staticGroup();
  crates.create(40, 460, "crate");
  crates.create(120, 460, "crate");
  crates.create(200, 460, "crate");

  // in the air
  crates.create(280, 340, "crate");
  crates.create(460, 300, "crate");
  crates.create(600, 240, "crate");
  crates.create(740, 400, "crate");

  this.anims.create({
    key: "knight_run",
    frames: [
      { key: "run_frame_1" },
      { key: "run_frame_2" },
      { key: "run_frame_3" },
      { key: "run_frame_4" },
      { key: "run_frame_5" },
      { key: "run_frame_6" },
      { key: "run_frame_7" },
      { key: "run_frame_8" },
      { key: "run_frame_9" },
      { key: "run_frame_10" },
    ],
    frameRate: 10,
    repeat: 1,
  });

  this.anims.create({
    key: "knight_idle",
    frames: [
      { key: "idle_frame_1" },
      { key: "idle_frame_2" },
      { key: "idle_frame_3" },
      { key: "idle_frame_4" },
      { key: "idle_frame_5" },
      { key: "idle_frame_6" },
      { key: "idle_frame_7" },
      { key: "idle_frame_8" },
      { key: "idle_frame_9" },
      { key: "idle_frame_10" },
    ],
    frameRate: 10,
    repeat: 1,
  });

  this.physics.add.collider(crates, knight);

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(16, 16, "Bitcoins: " + score, {
    fontSize: "32px",
    fill: "#000",
  });

  timeLeftText = this.add.text(16, 56, timeLeft + " sec left", {
    fontSize: "32px",
    fill: "#000",
  });

  coinTimer = this.time.addEvent({
    delay: Phaser.Math.Between(500, 3000),
    callback: generateCoins,
    callbackScope: this,
    repeat: -1,
  });

  timeLeftTimer = this.time.addEvent({
    delay: 1000,
    callback: updateTimeLeft,
    callbackScope: this,
    repeat: -1,
  });
}

function updateTimeLeft() {
  if (gameOver) {
    if (!coinSent) {
      let address = prompt("Please enter your ETH address: ", "0x000....");
      if (address == null || address == "") {
        alert("User cancel the prompt");
      } else {
        mintAfterGame(address, score);
        coinsent = true;
      }
    }
    return;
  }
  timeLeft -= 1;
  timeLeftText.setText(timeLeft + " sec left");
  if (timeLeft <= 0) {
    this.physics.pause();
    gameOver = true;
  }
}

function generateCoins() {
  let coins = this.physics.add.group({
    key: "coin",
    repeat: 1,
    setXY: {
      x: Phaser.Math.Between(0, 800),
      y: -100,
      stepX: Phaser.Math.Between(30, 100),
    },
  });

  coins.children.iterate(function (coin) {
    coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(coins, crates);
  this.physics.add.collider(knight, coins, collectCoin, null, this);
}

function collectCoin(knight, coin) {
  coin.disableBody(true, true);
  score++;
  scoreText.setText("Bitcoins: " + score);
}

// monitoring the inputs and telling the game how to
// update based on this inputs
function gameUpdate() {
  if (cursors.left.isDown) {
    knight.setVelocityX(-200);
    knight.play("knight_run", true);
    knight.flipX = true;
  } else if (cursors.right.isDown) {
    knight.setVelocityX(200);
    knight.play("knight_run", true);
    knight.flipX = false;
  } else {
    knight.setVelocityX(0);
    knight.play("knight_idle", true);
  }

  if (cursors.up.isDown && knight.body.touching.down) {
    knight.setVelocityY(-500);
  }
}

let game = new Phaser.Game(config);
