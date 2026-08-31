// ============================================================
//  2-PLAYER FIGHTER — GameLab starter
//  Two players, one keyboard:
//    Player 1:  A/D move, W jump,  F punch, G kick
//    Player 2:  ←/→ move, ↑ jump,  K punch, L kick
//  Punches are fast but weak; kicks are slow but strong.
//  Knock the other fighter's HP to zero to win!
//
//  Ideas to try:
//   - change the numbers in TWEAK ME (make kicks launch people!)
//   - add a special move that costs a "super" meter
//   - make it best-of-3 rounds with a round counter
//   - add a crouch or a block key that halves damage
// ============================================================

// ---- TWEAK ME ----------------------------------------------
const WALK_SPEED = 250;
const JUMP_POWER = 540;
const GRAVITY = 1200;
const MAX_HP = 100;

// Each attack: damage, how far it reaches, how long until you
// can attack again (ms), how hard it knocks the enemy back.
const PUNCH = { damage: 6,  reach: 60, cooldown: 320, knockback: 140, stun: 200 };
const KICK  = { damage: 12, reach: 78, cooldown: 700, knockback: 300, stun: 350 };
// ------------------------------------------------------------

const config = {
  type: Phaser.AUTO,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  width: 800,
  height: 450,
  backgroundColor: '#2b2038',
  physics: { default: 'arcade', arcade: { gravity: { y: GRAVITY } } },
  scene: { preload, create, update }
};
new Phaser.Game(config);

let p1, p2, keys, fightOver;

function preload() {
  // SWAP IN YOUR ART: generate two fighters in the Sprites tab,
  // save them, then un-comment (and setScale them in create()):
  // this.load.image('fighter1', 'assets/fighter1.png');
  // this.load.image('fighter2', 'assets/fighter2.png');
  // this.load.audio('punch', 'assets/punch.wav');
  // this.load.audio('kick', 'assets/kick.wav');

  makeRect(this, 'fighter1', 42, 88, 0x6bd5ff);
  makeRect(this, 'fighter2', 42, 88, 0xe05656);
  makeRect(this, 'floor', 800, 40, 0x4a3b5c);
  makeRect(this, 'fist', 26, 12, 0xffd94a);
}

function create() {
  fightOver = false;
  const floor = this.physics.add.staticImage(400, 430, 'floor');

  p1 = makeFighter(this, 220, 'fighter1');
  p2 = makeFighter(this, 580, 'fighter2');
  this.physics.add.collider(p1.sprite, floor);
  this.physics.add.collider(p2.sprite, floor);
  // Fighters push against each other instead of overlapping.
  this.physics.add.collider(p1.sprite, p2.sprite);

  p1.barBg = this.add.rectangle(200, 30, 320, 18, 0x000000);
  p2.barBg = this.add.rectangle(600, 30, 320, 18, 0x000000);
  p1.bar = this.add.rectangle(200, 30, 316, 14, 0x4cc79a);
  p2.bar = this.add.rectangle(600, 30, 316, 14, 0x4cc79a);
  this.add.text(60, 44, 'PLAYER 1', { fontSize: '14px', color: '#6bd5ff' });
  this.add.text(680, 44, 'PLAYER 2', { fontSize: '14px', color: '#e05656' });

  keys = this.input.keyboard.addKeys('W,A,D,F,G,UP,LEFT,RIGHT,K,L,R');
}

function update() {
  const now = this.time.now;

  // Fighters always face each other — that decides which way hits land.
  p1.facing = p1.sprite.x < p2.sprite.x ? 1 : -1;
  p2.facing = -p1.facing;
  p1.sprite.setFlipX(p1.facing === -1);
  p2.sprite.setFlipX(p2.facing === -1);

  if (!fightOver) {
    steer(p1, keys.A.isDown, keys.D.isDown, keys.W.isDown, now);
    steer(p2, keys.LEFT.isDown, keys.RIGHT.isDown, keys.UP.isDown, now);

    if (Phaser.Input.Keyboard.JustDown(keys.F)) attack(this, p1, p2, PUNCH, 'punch');
    if (Phaser.Input.Keyboard.JustDown(keys.G)) attack(this, p1, p2, KICK, 'kick');
    if (Phaser.Input.Keyboard.JustDown(keys.K)) attack(this, p2, p1, PUNCH, 'punch');
    if (Phaser.Input.Keyboard.JustDown(keys.L)) attack(this, p2, p1, KICK, 'kick');
  }

  p1.bar.width = 316 * (p1.hp / MAX_HP);
  p2.bar.width = 316 * (p2.hp / MAX_HP);
  p1.bar.fillColor = p1.hp > 30 ? 0x4cc79a : 0xe05656;
  p2.bar.fillColor = p2.hp > 30 ? 0x4cc79a : 0xe05656;
}

function steer(f, left, right, jump, now) {
  if (now < f.stunnedUntil) return; // can't move while stunned by a hit
  if (left) f.sprite.setVelocityX(-WALK_SPEED);
  else if (right) f.sprite.setVelocityX(WALK_SPEED);
  else f.sprite.setVelocityX(0);
  if (jump && f.sprite.body.blocked.down) f.sprite.setVelocityY(-JUMP_POWER);
}

function attack(scene, attacker, defender, move, soundName) {
  const now = scene.time.now;
  if (fightOver || now < attacker.nextAttackAt || now < attacker.stunnedUntil) return;
  attacker.nextAttackAt = now + move.cooldown;

  // Show the fist/foot flying out for a moment.
  const fist = scene.add.image(
    attacker.sprite.x + attacker.facing * (30 + move.reach / 2),
    attacker.sprite.y - (move === KICK ? -10 : 14),
    'fist'
  );
  scene.time.delayedCall(110, () => fist.destroy());
  // SWAP IN YOUR SOUND: scene.sound.play(soundName);

  // Did it land? Close enough, and the defender is in front of us.
  const dx = defender.sprite.x - attacker.sprite.x;
  const dy = Math.abs(defender.sprite.y - attacker.sprite.y);
  const inFront = Math.sign(dx) === attacker.facing;
  if (inFront && Math.abs(dx) < move.reach + 42 && dy < 70) {
    defender.hp = Math.max(0, defender.hp - move.damage);
    defender.stunnedUntil = now + move.stun;
    defender.sprite.setVelocityX(attacker.facing * move.knockback);
    defender.sprite.setVelocityY(-120);
    flash(scene, defender.sprite);
    if (defender.hp <= 0) endFight(scene, attacker === p1 ? 'PLAYER 1' : 'PLAYER 2');
  }
}

function endFight(scene, winner) {
  fightOver = true;
  scene.add.text(400, 180, winner + ' WINS! 🏆', { fontSize: '44px', color: '#ffd94a' }).setOrigin(0.5);
  scene.add.text(400, 230, 'press R for a rematch', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
  scene.input.keyboard.once('keydown-R', () => scene.scene.restart());
}

// ---- helpers (you can ignore these) ------------------------
function makeFighter(scene, x, texture) {
  const sprite = scene.physics.add.sprite(x, 300, texture);
  sprite.setCollideWorldBounds(true);
  return { sprite, hp: MAX_HP, facing: 1, nextAttackAt: 0, stunnedUntil: 0 };
}

function flash(scene, sprite) {
  sprite.setTintFill(0xffffff);
  scene.time.delayedCall(90, () => sprite.clearTint());
}

function makeRect(scene, key, w, h, color) {
  const g = scene.add.graphics();
  g.fillStyle(color).fillRect(0, 0, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}
