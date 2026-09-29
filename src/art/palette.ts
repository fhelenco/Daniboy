// Cores de massinha: [luz, base, sombra]. Cada uma vira dois gradientes globais:
// url(#c-nome) = volume (radial, luz no alto à esquerda) e url(#v-nome) = faixa vertical.
export const PALETTE = {
  // Daniboy (referência: blusa verde-sálvia, jeans, sapato marrom, cabelo dourado)
  skin: ['#ffe2c8', '#f6c5a0', '#d9956e'],
  nose: ['#ffc2ae', '#f4a08a', '#d27862'],
  hair: ['#f6e3a0', '#dcb862', '#a8823a'],
  hairLight: ['#fff1c2', '#ebcd7c', '#bf9748'],
  shirt: ['#a9cd88', '#739e55', '#4b7236'],
  jeans: ['#7d9fe0', '#4468b2', '#2a4682'],
  shoe: ['#c89470', '#8e5d3b', '#5c3a22'],
  iris: ['#9fd3ff', '#3a86d6', '#1b4f9a'],

  // céu e luz
  skyForest: ['#79c3f5', '#b5defa', '#fff0d2'],
  skyDesert: ['#f59b78', '#ffbf8a', '#ffdcaa'],
  sunPale: ['#fffbe2', '#fbe89c', '#ecc862'],
  skyOcean: ['#5ab8f0', '#a2dcfa', '#eaf8ff'],
  cloud: ['#ffffff', '#f5f6fb', '#d6dde9'],
  sun: ['#fff8cf', '#ffd955', '#f4a52a'],

  cloudWarm: ['#fff6ea', '#fbdcc6', '#e0ae93'],

  // interface (placas de madeira, papel, botões de biscoito)
  plank: ['#e6b676', '#bd8140', '#8a5626'],
  frame: ['#c98444', '#94592a', '#623a1a'],
  cream: ['#fffbf0', '#fdeecb', '#ead3a0'],
  paper: ['#fff8e6', '#f8e6bd', '#e2c98f'],
  gold: ['#ffe58a', '#f7bd43', '#c98a14'],
  leafBright: ['#b4e878', '#58b34c', '#2f7d36'],

  // floresta (referência: folhas redondas verde-limão, samambaias, picos de pedra ao fundo)
  lime: ['#e6f294', '#b5d155', '#789830'],
  fern: ['#a8d880', '#57a14a', '#2f6c30'],
  spire: ['#c7d2e4', '#9aa9c2', '#76859f'],
  haze:['#d4ecc4', '#b4d9a0', '#95c485'],
  hazePine: ['#a9d0a8', '#88bb8c', '#6fa677'],
  leafLight: ['#bdea8c', '#7fc757', '#509a39'],
  leaf: ['#9cd672', '#5aa641', '#377a2b'],
  leafDark: ['#7cb85c', '#418a35', '#265d21'],
  pine: ['#8acb9b', '#43915f', '#265f3c'],
  trunk: ['#d19a68', '#9b653a', '#633d20'],
  moss: ['#c8e98c', '#8fc653', '#5d9234'],
  dirt: ['#f4a868', '#d27c44', '#a3572c'],
  hill: ['#cdea8e', '#98cc5c', '#67a23b'],
  mountain: ['#bcd9c4', '#95c0a8', '#739f8c'],
  rock: ['#e3dfd6', '#b1aca2', '#7c776e'],
  water: ['#b5ecfb', '#5bbfe6', '#2f86bf'],
  wood: ['#e4ad72', '#b67d45', '#7c5025'],
  petal: ['#ffffff', '#f6f2eb', '#d7d0c3'],
  pollen: ['#fff2a3', '#f8c733', '#c98f14'],
  mushroom: ['#ff9f8c', '#ec5a45', '#b03627'],

  // deserto
  sand: ['#f7b46c', '#e6914a', '#c46d2e'],
  dune: ['#ec9c5e', '#d0773a', '#a65222'],
  mesa: ['#f2a27c', '#d06b46', '#9d472a'],
  mesaHaze: ['#f6b495', '#e08a68', '#bd6649'],
  cactus: ['#abe089', '#61ab59', '#387b3e'],
  bloom: ['#ffc8d8', '#ff82a8', '#d94e7e'],
  dryGrass: ['#f2dc9a', '#d8b766', '#a9853a'],
  boulder: ['#f29c7a', '#d06847', '#9b4128'],
  agave: ['#b3dcbc', '#66a382', '#3c7258'],

  // oceano
  sea: ['#a3e6f7', '#42b3dc', '#1f76ae'],
  deep: ['#78c9ec', '#2f8fca', '#1b5f95'],
  foam: ['#ffffff', '#f0fbff', '#c9e8f3'],
  turq: ['#a6f2ea', '#37c6cf', '#1a8da6'],
  coral: ['#ffab8f', '#f26548', '#bd3f2a'],
  wetSand: ['#f1d6a2', '#dcb577', '#b58b4f'],
  palm: ['#dcab72', '#ab7a46', '#744e25'],
  shell: ['#fff2e8', '#ffc9b2', '#e2937c'],
  drift: ['#efe4d4', '#c6b49a', '#8e7c64'],
  rope: ['#f3dfb6', '#d6b882', '#a5854f'],
  boat: ['#ff9a8a', '#e8524a', '#a8302b'],

  // bichos
  capy: ['#d9a87b', '#aa754c', '#744b2c'],
  toucan: ['#6d6d7a', '#32323c', '#17171d'],
  beak: ['#ffe28c', '#ff9f30', '#e06118'],
  monkey: ['#cb996c', '#956139', '#5f3a1d'],
  face: ['#fce5ca', '#f0caa2', '#caa06f'],
  sloth: ['#d6bf9c', '#a9906c', '#705d43'],
  armadillo: ['#e3c7ae', '#b9957c', '#806450'],
  camel: ['#f7d49d', '#dea964', '#a8763b'],
  fennec: ['#fde7c5', '#f1c68d', '#c7925a'],
  meerkat: ['#efd8b1', '#ceae7e', '#967852'],
  lizard: ['#c6ea8e', '#83c450', '#4f8b2c'],
  owl: ['#e4c49a', '#b08a5d', '#735737'],
  eyeYellow: ['#fff8ac', '#ffd93b', '#e0a712'],
  crab: ['#ffab8c', '#f36142', '#b63b23'],
  turtleShell: ['#b6e087', '#67a74e', '#3d722e'],
  turtleSkin: ['#e8f1b7', '#bfd488', '#8ba35b'],
  star: ['#ffd180', '#ff933f', '#d96420'],
  dolphin: ['#d0ebff', '#89bbe3', '#5281b2'],
  whale: ['#a0c0e8', '#5883c2', '#33518b'],
  belly: ['#ffffff', '#f2f6fb', '#d1dceb'],
  pink: ['#ffd3dc', '#ffa2b4', '#e2728a'],
  dark: ['#5c4e58', '#302732', '#181219'],
} as const;

export type ClayColor = keyof typeof PALETTE;
