// ============================================================
//  VERTICAL SHOOTER — GameLab starter
//  Arrow keys to fly, SPACE to shoot. Enemies come in waves
//  from the top — don't let them get past you!
//
//  Ideas to try:
//   - change the numbers in TWEAK ME
//   - make enemies shoot back (copy how the player shoots)
//   - add a boss every 5 waves with lots of HP
//   - want a SIDE-scroller instead? Move the ship to the left
//     edge and change the velocities from Y to X!
// ============================================================

// ---- TWEAK ME ----------------------------------------------
const SHIP_SPEED = 300;
const BULLET_SPEED = 500;
const FIRE_DELAY = 220;       // milliseconds between shots
const ENEMY_SPEED = 70;       // how fast enemies descend
const SPAWN_EVERY = 1100;     // milliseconds between enemies
const START_LIVES = 3;
// ------------------------------------------------------------

const config = {
  type: Phaser.AUTO,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  width: 480,
  height: 640,
  backgroundColor: '#0b0f22',
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};
new Phaser.Game(config);

let ship, cursors, fireKey, bullets, enemies;
let score, lives, lastFired, scoreText, livesText, gameOver;

function preload() {
  // SWAP IN YOUR ART: generate sprites in the editor, save them,
  // then un-comment (and shrink with setScale in create()):
  // this.load.image('ship', 'assets/ship.png');
  // this.load.image('enemy', 'assets/enemy.png');
  // this.load.audio('laser', 'assets/laser.wav');
  // this.load.audio('boom', 'assets/boom.wav');

  makeRect(this, 'ship', 30, 34, 0x6bd5ff);
  makeRect(this, 'enemy', 30, 26, 0xe05656);
  makeRect(this, 'bullet', 4, 12, 0xffd94a);
  makeRect(this, 'star', 2, 2, 0xffffff);
}

function create() {
  score = 0; lives = START_LIVES; lastFired = 0; gameOver = false;

  // Scrolling starfield background.
  this.stars = [];
  for (let i = 0; i < 60; i++) {
    const s = this.add.image(Phaser.Math.Between(0, 480), Phaser.Math.Between(0, 640), 'star');
    s.speed = Phaser.Math.Between(30, 120);
    this.stars.push(s);
  }

  ship = this.physics.add.sprite(240, 570, 'ship');
  // SWAP IN YOUR ART: ship.setScale(0.12);
  ship.setCollideWorldBounds(true);

  bullets = this.physics.add.group();
  enemies = this.physics.add.group();

  // Spawn a new enemy on a timer, forever.
  this.time.addEvent({
    delay: SPAWN_EVERY,
    loop: true,
    callback: () => {
      if (gameOver) return;
      const e = enemies.create(Phaser.Math.Between(30, 450), -20, 'enemy');
      e.setVelocityY(ENEMY_SPEED + score * 2); // gets faster as you score!
      e.setVelocityX(Phaser.Math.Between(-40, 40));
    }
  });

  this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
    bullet.destroy();
    enemy.destroy();
    score += 1;
    scoreText.setText('Score: ' + score);
    // SWAP IN YOUR SOUND: this.sound.play('boom');
  });

  this.physics.add.overlap(ship, enemies, (s, enemy) => {
    enemy.destroy();
    loseLife(this);
  });

  scoreText = this.add.text(12, 10, 'Score: 0', { fontSize: '18px', color: '#fff' });
  livesText = this.add.text(380, 10, '❤'.repeat(lives), { fontSize: '18px', color: '#e05656' });

  cursors = this.input.keyboard.createCursorKeys();
  fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update(time) {
  // Move the starfield down so it feels like flying.
  this.stars.forEach((s) => {
    s.y += s.speed / 60;
    if (s.y > 640) { s.y = 0; s.x = Phaser.Math.Between(0, 480); }
  });

  if (gameOver) return;

  ship.setVelocity(0);
  if (cursors.left.isDown) ship.setVelocityX(-SHIP_SPEED);
  else if (cursors.right.isDown) ship.setVelocityX(SHIP_SPEED);
  if (cursors.up.isDown) ship.setVelocityY(-SHIP_SPEED);
  else if (cursors.down.isDown) ship.setVelocityY(SHIP_SPEED);

  if (fireKey.isDown && time > lastFired + FIRE_DELAY) {
    lastFired = time;
    const b = bullets.create(ship.x, ship.y - 24, 'bullet');
    b.setVelocityY(-BULLET_SPEED);
    // SWAP IN YOUR SOUND: this.sound.play('laser');
  }

  // Clean up bullets that flew off-screen; enemies that slipped past cost a life.
  bullets.children.each((b) => { if (b.y < -20) b.destroy(); });
  enemies.children.each((e) => {
    // Bounce enemies off the side walls so they zig-zag downward.
    if (e.x < 15 && e.body.velocity.x < 0) e.setVelocityX(-e.body.velocity.x);
    if (e.x > 465 && e.body.velocity.x > 0) e.setVelocityX(-e.body.velocity.x);
    if (e.y > 660) { e.destroy(); loseLife(this); }
  });
}

function loseLife(scene) {
  if (gameOver) return;
  lives -= 1;
  livesText.setText('❤'.repeat(Math.max(0, lives)));
  scene.cameras.main.shake(150, 0.01);
  if (lives <= 0) {
    gameOver = true;
    scene.physics.pause();
    scene.add.text(240, 300, 'GAME OVER', { fontSize: '40px', color: '#e05656' }).setOrigin(0.5);
    scene.add.text(240, 350, 'press R to try again', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    scene.input.keyboard.once('keydown-R', () => scene.scene.restart());
  }
}

// ---- helpers (you can ignore these) ------------------------
function makeRect(scene, key, w, h, color) {
  const g = scene.add.graphics();
  g.fillStyle(color).fillRect(0, 0, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}
