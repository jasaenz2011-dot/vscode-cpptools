// ============================================================
//  TURN-BASED RPG BATTLE — GameLab starter
//  Use UP/DOWN to pick a move, ENTER to use it. Then the
//  monster attacks back. Reduce its HP to zero to win!
//
//  Ideas to try:
//   - change the numbers in TWEAK ME
//   - add a new move to the MOVES list (e.g. Poison, Shield)
//   - give the monster smarter choices in monsterTurn()
//   - add a second monster after the first is defeated
// ============================================================

// ---- TWEAK ME ----------------------------------------------
const HERO_MAX_HP = 60;
const MONSTER_MAX_HP = 55;
const MONSTER_DAMAGE = [6, 12];   // monster hits for 6-12

// Each move: name, what it does. damage hurts the monster,
// heal restores your HP, mp is the magic cost.
const MOVES = [
  { name: 'Attack',   damage: [7, 11], heal: 0,  mp: 0 },
  { name: 'Fireball', damage: [14, 20], heal: 0, mp: 4 },
  { name: 'Heal',     damage: [0, 0],  heal: 15, mp: 3 }
];
const HERO_MAX_MP = 10;
// ------------------------------------------------------------

const config = {
  type: Phaser.AUTO,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  width: 800,
  height: 450,
  backgroundColor: '#241d33',
  scene: { preload, create }
};
new Phaser.Game(config);

let hero, monster, menuItems, log, mpText;
let selected = 0;
let busy = false; // true while an animation/turn is playing

function preload() {
  // SWAP IN YOUR ART: generate a hero and a monster in the
  // Sprites tab, save them, then un-comment:
  // this.load.image('hero', 'assets/hero.png');
  // this.load.image('monster', 'assets/monster.png');

  makeRect(this, 'hero', 70, 90, 0x6bd5ff);
  makeRect(this, 'monster', 110, 90, 0xe05656);
}

function create() {
  hero = { hp: HERO_MAX_HP, mp: HERO_MAX_MP, sprite: this.add.sprite(180, 240, 'hero') };
  monster = { hp: MONSTER_MAX_HP, sprite: this.add.sprite(600, 200, 'monster') };
  // SWAP IN YOUR ART: if your sprite is big: hero.sprite.setScale(0.3);

  hero.bar = makeHpBar(this, 110, 310);
  monster.bar = makeHpBar(this, 530, 270);

  this.add.text(110, 330, 'HERO', { fontSize: '16px', color: '#9ad' });
  this.add.text(530, 290, 'MONSTER', { fontSize: '16px', color: '#d99' });

  // Battle menu (bottom-left box).
  menuItems = MOVES.map((m, i) =>
    this.add.text(60 + i * 180, 385, '', { fontSize: '20px', color: '#fff' })
  );

  log = this.add.text(60, 415, 'A wild monster appears!', { fontSize: '16px', color: '#ffd94a' });
  mpText = this.add.text(110, 350, '', { fontSize: '14px', color: '#9ad' });

  drawAll();

  this.input.keyboard.on('keydown-UP', () => moveCursor(-1));
  this.input.keyboard.on('keydown-DOWN', () => moveCursor(1));
  this.input.keyboard.on('keydown-LEFT', () => moveCursor(-1));
  this.input.keyboard.on('keydown-RIGHT', () => moveCursor(1));
  this.input.keyboard.on('keydown-ENTER', () => heroTurn(this));
  this.input.keyboard.on('keydown-SPACE', () => heroTurn(this));
}

function moveCursor(dir) {
  if (busy) return;
  selected = (selected + dir + MOVES.length) % MOVES.length;
  drawAll();
}

function heroTurn(scene) {
  if (busy || hero.hp <= 0 || monster.hp <= 0) return;
  const move = MOVES[selected];
  if (move.mp > hero.mp) { log.setText('Not enough MP!'); return; }
  busy = true;
  hero.mp -= move.mp;

  const dmg = randBetween(move.damage[0], move.damage[1]);
  monster.hp = Math.max(0, monster.hp - dmg);
  hero.hp = Math.min(HERO_MAX_HP, hero.hp + move.heal);

  log.setText(move.heal > 0
    ? `You cast ${move.name} and heal ${move.heal} HP!`
    : `You use ${move.name} for ${dmg} damage!`);
  shake(scene, move.heal > 0 ? hero.sprite : monster.sprite);
  drawAll();

  if (monster.hp <= 0) return endBattle(scene, true);
  scene.time.delayedCall(900, () => monsterTurn(scene));
}

function monsterTurn(scene) {
  const dmg = randBetween(MONSTER_DAMAGE[0], MONSTER_DAMAGE[1]);
  hero.hp = Math.max(0, hero.hp - dmg);
  log.setText(`The monster hits you for ${dmg}!`);
  shake(scene, hero.sprite);
  drawAll();
  if (hero.hp <= 0) return endBattle(scene, false);
  busy = false;
}

function endBattle(scene, won) {
  busy = true;
  scene.time.delayedCall(600, () => {
    log.setText(won ? 'VICTORY! 🎉  (press R to battle again)' : 'You were defeated… (press R to retry)');
    scene.input.keyboard.once('keydown-R', () => { busy = false; selected = 0; scene.scene.restart(); });
  });
}

// ---- drawing helpers (you can ignore these) ----------------
function drawAll() {
  drawHpBar(hero.bar, hero.hp / HERO_MAX_HP, 0x4cc79a);
  drawHpBar(monster.bar, monster.hp / MONSTER_MAX_HP, 0xe05656);
  menuItems.forEach((t, i) => {
    const m = MOVES[i];
    const label = `${i === selected ? '▶ ' : '  '}${m.name}${m.mp ? ` (${m.mp}mp)` : ''}`;
    t.setText(label).setColor(i === selected ? '#ffd94a' : '#ffffff');
  });
  mpText.setText(`MP: ${hero.mp}/${HERO_MAX_MP}`);
}

function makeHpBar(scene, x, y) {
  const g = scene.add.graphics();
  g.barX = x; g.barY = y;
  return g;
}

function drawHpBar(g, ratio, color) {
  g.clear();
  g.fillStyle(0x000000).fillRect(g.barX, g.barY, 160, 14);
  g.fillStyle(color).fillRect(g.barX + 2, g.barY + 2, Math.max(0, 156 * ratio), 10);
}

function shake(scene, sprite) {
  scene.tweens.add({ targets: sprite, x: sprite.x + 10, duration: 60, yoyo: true, repeat: 3 });
}

function randBetween(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function makeRect(scene, key, w, h, color) {
  const g = scene.add.graphics();
  g.fillStyle(color).fillRect(0, 0, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}
