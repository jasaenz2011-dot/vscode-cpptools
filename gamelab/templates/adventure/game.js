// ============================================================
//  OVERHEAD ADVENTURE — GameLab starter
//  Arrow keys to walk. Collect all the keys 🔑, avoid the
//  monsters, then reach the door to win.
//
//  THE LEVEL IS DRAWN WITH TEXT below — edit it to build your
//  own dungeon! Each letter is one tile:
//    W = wall   K = key   D = locked door   M = monster
//    P = player start     . = empty floor
// ============================================================

const LEVEL = [
  'WWWWWWWWWWWWWWWWWWWWWWWWW',
  'W...P.......W........K..W',
  'W...........W...........W',
  'W...WWWW....WWWWWW..WWWWW',
  'W...W..........W........W',
  'W.K.W....M.....W....M...W',
  'W...W..........W........W',
  'WWWWW...WWWW...WWWWW....W',
  'W..........W........W...W',
  'W...M......W...K....W...W',
  'W..........W........W...W',
  'W...WWWWWWWWWWW..WWWW...W',
  'W.......................W',
  'WWWWWWWWWWWWWWWWWWWWWWWDW'
];

// ---- TWEAK ME ----------------------------------------------
const TILE = 32;            // size of one tile in pixels
const PLAYER_SPEED = 170;
const MONSTER_SPEED = 80;
// ------------------------------------------------------------

const config = {
  type: Phaser.AUTO,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  width: LEVEL[0].length * TILE,
  height: LEVEL.length * TILE,
  backgroundColor: '#20301c',
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};
new Phaser.Game(config);

let player, cursors, door, keysLeft, statusText;

function preload() {
  // SWAP IN YOUR ART: generate sprites in the editor, save them,
  // then un-comment these lines (and shrink with setScale in create()).
  // this.load.image('hero', 'assets/hero.png');
  // this.load.audio('key', 'assets/key.wav');

  makeRect(this, 'hero', 24, 24, 0x6bd5ff);
  makeRect(this, 'wall', TILE, TILE, 0x5a4632);
  makeRect(this, 'key', 16, 16, 0xffd94a);
  makeRect(this, 'door', TILE, TILE, 0x8f6bff);
  makeRect(this, 'monster', 24, 24, 0xe05656);
}

function create() {
  const walls = this.physics.add.staticGroup();
  const keys = this.physics.add.group({ allowGravity: false });
  const monsters = this.physics.add.group();

  // Build the world from the LEVEL text, one tile at a time.
  LEVEL.forEach((row, ty) => {
    [...row].forEach((ch, tx) => {
      const x = tx * TILE + TILE / 2;
      const y = ty * TILE + TILE / 2;
      if (ch === 'W') walls.create(x, y, 'wall');
      if (ch === 'K') keys.create(x, y, 'key');
      if (ch === 'D') door = this.physics.add.staticSprite(x, y, 'door');
      if (ch === 'P') player = this.physics.add.sprite(x, y, 'hero');
      if (ch === 'M') {
        const m = monsters.create(x, y, 'monster');
        m.setVelocityX(MONSTER_SPEED);
        m.setBounce(1); // bounce off walls to patrol back and forth
        m.setCollideWorldBounds(true);
      }
    });
  });

  keysLeft = keys.countActive(true);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, walls);
  this.physics.add.collider(monsters, walls);
  this.physics.add.collider(player, monsters, () => this.scene.restart());

  this.physics.add.overlap(player, keys, (p, key) => {
    key.destroy();
    keysLeft -= 1;
    // SWAP IN YOUR SOUND: this.sound.play('key');
    updateStatus();
  });

  this.physics.add.collider(player, door, () => {
    if (keysLeft === 0) {
      this.add.text(config.width / 2, config.height / 2, 'YOU ESCAPED! 🎉',
        { fontSize: '40px', color: '#ffd94a' }).setOrigin(0.5);
      this.physics.pause();
    }
  });

  statusText = this.add.text(10, 8, '', { fontSize: '18px', color: '#fff' });
  updateStatus();
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (!player.body) return;
  player.setVelocity(0);
  if (cursors.left.isDown) player.setVelocityX(-PLAYER_SPEED);
  else if (cursors.right.isDown) player.setVelocityX(PLAYER_SPEED);
  if (cursors.up.isDown) player.setVelocityY(-PLAYER_SPEED);
  else if (cursors.down.isDown) player.setVelocityY(PLAYER_SPEED);
}

function updateStatus() {
  statusText.setText(keysLeft > 0 ? `Keys left: ${keysLeft}` : 'All keys found — get to the door!');
}

// ---- helpers (you can ignore these) ------------------------
function makeRect(scene, key, w, h, color) {
  const g = scene.add.graphics();
  g.fillStyle(color).fillRect(0, 0, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}
