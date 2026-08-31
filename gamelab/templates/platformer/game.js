// ============================================================
//  SIDE-SCROLLING PLATFORMER — GameLab starter
//  Arrow keys to move, UP to jump. Collect coins, avoid spikes!
//
//  The game works out of the box using colored rectangles.
//  Replace them with your own AI sprites: generate one in the
//  Sprites tab, save it, then follow the "SWAP IN YOUR ART"
//  comments below.
// ============================================================

// ---- TWEAK ME ----------------------------------------------
const PLAYER_SPEED = 220;   // how fast you run
const JUMP_POWER = 460;     // how high you jump
const GRAVITY = 900;        // how fast you fall
const LEVEL_WIDTH = 2400;   // how wide the world is
// ------------------------------------------------------------

const config = {
  type: Phaser.AUTO,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  width: 800,
  height: 450,
  backgroundColor: '#1a2340',
  physics: { default: 'arcade', arcade: { gravity: { y: GRAVITY } } },
  scene: { preload, create, update }
};
new Phaser.Game(config);

let player, cursors, coins, scoreText;
let score = 0;

function preload() {
  // SWAP IN YOUR ART: generate sprites in the editor, save them,
  // then un-comment these lines (and the matching lines in create()).
  // this.load.image('hero', 'assets/hero.png');
  // this.load.audio('jump', 'assets/jump.wav');
  // this.load.audio('coin', 'assets/coin.wav');

  // Placeholder art: simple colored rectangles drawn in code.
  makeRect(this, 'hero', 28, 36, 0x6bd5ff);
  makeRect(this, 'ground', 64, 32, 0x4a7a3a);
  makeRect(this, 'coin', 18, 18, 0xffd94a);
  makeRect(this, 'spike', 24, 24, 0xe05656);
}

function create() {
  score = 0;
  // World is a bit deeper than the screen so falling into a gap is possible.
  this.physics.world.setBounds(0, 0, LEVEL_WIDTH, 700);

  // --- platforms: x, y, how many blocks wide ---
  const platforms = this.physics.add.staticGroup();
  addPlatform(platforms, 0, 434, 14);
  addPlatform(platforms, 950, 434, 8);
  addPlatform(platforms, 1600, 434, 13);
  addPlatform(platforms, 400, 320, 3);
  addPlatform(platforms, 700, 240, 3);
  addPlatform(platforms, 1100, 300, 4);
  addPlatform(platforms, 1450, 220, 3);
  addPlatform(platforms, 1900, 320, 3);

  // --- player ---
  player = this.physics.add.sprite(80, 300, 'hero');
  // SWAP IN YOUR ART: if your sprite is big, shrink it:
  // player.setScale(0.15);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);

  // --- coins: place them anywhere ---
  coins = this.physics.add.group({ allowGravity: false });
  [[420, 280], [760, 200], [1150, 260], [1500, 180], [1950, 280], [2200, 380]]
    .forEach(([x, y]) => coins.create(x, y, 'coin'));
  this.physics.add.overlap(player, coins, collectCoin, null, this);

  // --- spikes: touching one restarts the level ---
  const spikes = this.physics.add.staticGroup();
  [[1000, 410], [1700, 410], [2100, 410]].forEach(([x, y]) => spikes.create(x, y, 'spike'));
  this.physics.add.collider(player, spikes, () => this.scene.restart());

  // --- camera follows the player through the level ---
  this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, 450);
  this.cameras.main.startFollow(player, true, 0.1, 0.1);

  scoreText = this.add.text(16, 12, 'Coins: 0', { fontSize: '20px', color: '#fff' })
    .setScrollFactor(0); // stays glued to the screen

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-PLAYER_SPEED);
    player.setFlipX(true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(PLAYER_SPEED);
    player.setFlipX(false);
  } else {
    player.setVelocityX(0);
  }

  const onGround = player.body.blocked.down;
  if (cursors.up.isDown && onGround) {
    player.setVelocityY(-JUMP_POWER);
    // SWAP IN YOUR SOUND: this.sound.play('jump');
  }

  // Fell into a gap? Restart the level.
  if (player.y > 520) {
    this.scene.restart();
  }
}

function collectCoin(playerSprite, coin) {
  coin.destroy();
  score += 1;
  scoreText.setText('Coins: ' + score);
  // SWAP IN YOUR SOUND: this.sound.play('coin');
  if (coins.countActive(true) === 0) {
    this.add.text(400, 200, 'YOU WIN! 🎉', { fontSize: '40px', color: '#ffd94a' })
      .setOrigin(0.5).setScrollFactor(0);
    this.physics.pause();
  }
}

// ---- helpers (you can ignore these) ------------------------
function makeRect(scene, key, w, h, color) {
  const g = scene.add.graphics();
  g.fillStyle(color).fillRect(0, 0, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}

function addPlatform(group, x, y, blocks) {
  for (let i = 0; i < blocks; i++) group.create(x + 32 + i * 64, y, 'ground');
}
