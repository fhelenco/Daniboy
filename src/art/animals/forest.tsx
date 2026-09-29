import { C, Line, S, Sheen } from '../Clay';
import { blob, ell, leafPath, rrect } from '../geom';
import { Cheek, Eye, Ground, Nose, Smile, Svg } from './parts';

export function Capivara() {
  return (
    <Svg>
      <Ground rx={120} />
      <C d={rrect(196, 238, 26, 46, 12)} c="capy" />
      <C d={rrect(96, 238, 26, 46, 12)} c="capy" />
      <C d={blob(172, 200, 100, 62, 3, 0.04)} c="capy" />
      <C d={rrect(222, 244, 26, 42, 12)} c="capy" />
      <C d={rrect(120, 244, 26, 42, 12)} c="capy" />
      <Sheen cx={160} cy={164} rx={46} ry={16} o={0.45} />
      <C d={blob(92, 160, 58, 48, 4, 0.04)} c="capy" />
      <C d={blob(52, 178, 40, 32, 5, 0.04)} c="capy" />
      <C d={ell(116, 118, 13, 11)} c="capy" />
      <Line d="M110 116Q116 112 122 118" color="rgb(80 40 20 / 0.4)" />
      <Nose x={22} y={170} r={4} />
      <Nose x={32} y={165} r={4} />
      <Eye x={88} y={150} r={9} />
      <Cheek x={70} y={188} r={10} />
      <Smile x={40} y={196} w={16} />
      {/* passarinho amigo nas costas */}
      <C d={leafPath(18, 8)} c="beak" t="translate(208 134) rotate(110)" />
      <C d={ell(196, 132, 16, 13)} c="pollen" />
      <C d={ell(186, 121, 10)} c="pollen" />
      <path d="M176 121L168 124L176 127Z" fill="#ff9f30" />
      <circle cx={184} cy={119} r={2.2} fill="#2a1f28" />
    </Svg>
  );
}

export function Tucano() {
  return (
    <Svg>
      <Ground rx={80} />
      <C d={rrect(100, 200, 110, 86, 22)} c="trunk" />
      <C d={ell(155, 204, 55, 16)} c="wood" />
      <Line d={ell(155, 204, 30, 8)} color="rgb(90 50 20 / 0.35)" />
      <C d={rrect(176, 170, 26, 62, 12)} c="toucan" t="rotate(-14 189 200)" />
      <C d={blob(166, 140, 46, 62, 7, 0.04)} c="toucan" />
      <C d={blob(140, 130, 26, 40, 8, 0.05)} c="pollen" />
      <C d={leafPath(72, 26)} c="toucan" t="translate(188 108) rotate(170)" />
      <C d={ell(146, 90, 36)} c="toucan" />
      <C d={ell(132, 98, 18, 20)} c="pollen" />
      <C d={ell(128, 82, 12)} c="#6ec6ff" grain={false} />
      <Eye x={128} y={82} r={7} />
      <C d="M122 74C92 62 44 72 24 102C54 99 90 101 122 100Z" c="beak" />
      <C d="M24 102C30 92 40 85 52 81L52 100Z" c="#2a1f28" />
      <Line d="M118 88Q80 84 40 98" color="rgb(160 60 10 / 0.35)" />
      <C d={ell(146, 202, 10, 6)} c="beak" />
      <C d={ell(170, 202, 10, 6)} c="beak" />
    </Svg>
  );
}

export function Macaco() {
  return (
    <Svg>
      <Ground rx={90} />
      <S d="M200 262C252 268 268 214 240 200C224 192 214 212 230 216" c="monkey" w={14} />
      <C d={blob(150, 216, 58, 64, 11, 0.04)} c="monkey" />
      <C d={blob(148, 226, 36, 44, 12, 0.05)} c="face" />
      <C d={ell(118, 280, 22, 11)} c="face" />
      <C d={ell(182, 280, 22, 11)} c="face" />
      <S d="M112 176Q100 214 128 226" c="monkey" w={20} />
      <S d="M188 176Q200 214 172 226" c="monkey" w={20} />
      <S d="M118 216Q148 240 182 210" c="#ffd84a" w={15} />
      <path d="M182 210l8 -7" stroke="#6b4a1e" strokeWidth={6} strokeLinecap="round" />
      <C d={ell(128, 226, 11)} c="face" />
      <C d={ell(172, 226, 11)} c="face" />
      <C d={ell(96, 118, 20)} c="monkey" />
      <C d={ell(96, 118, 11)} c="face" />
      <C d={ell(204, 118, 20)} c="monkey" />
      <C d={ell(204, 118, 11)} c="face" />
      <C d={ell(150, 116, 56, 52)} c="monkey" />
      <C d="M150 96C136 76 104 84 108 112C110 132 126 152 150 154C174 152 190 132 192 112C196 84 164 76 150 96Z" c="face" />
      <Eye x={134} y={110} r={10} />
      <Eye x={166} y={110} r={10} />
      <Nose x={144} y={130} r={3} />
      <Nose x={156} y={130} r={3} />
      <Smile x={150} y={138} w={22} />
      <Cheek x={120} y={134} />
      <Cheek x={180} y={134} />
    </Svg>
  );
}

export function Preguica() {
  return (
    <Svg>
      <Ground rx={70} />
      <C d={rrect(122, 20, 60, 270, 26)} c="trunk" />
      <Line d="M140 40V270M162 60V260" color="rgb(70 40 15 / 0.25)" w={4} />
      <C d={blob(152, 34, 64, 28, 3, 0.15)} c="leaf" />
      <C d={blob(150, 178, 54, 70, 13, 0.05)} c="sloth" />
      <S d="M112 150Q96 126 128 112" c="sloth" w={24} />
      <S d="M190 150Q206 126 176 112" c="sloth" w={24} />
      <S d="M118 222Q98 244 124 256" c="sloth" w={24} />
      <S d="M184 222Q204 244 178 256" c="sloth" w={24} />
      <Line d="M126 108l-6 -8M132 110l-2 -10M170 110l2 -10M176 108l6 -8" color="#3a2a1a" w={3.5} />
      <C d={ell(150, 96, 44, 40)} c="sloth" />
      <C d={ell(150, 102, 34, 27)} c="face" />
      <ellipse cx={134} cy={98} rx={13} ry={8} fill="#6b5238" transform="rotate(-18 134 98)" />
      <ellipse cx={166} cy={98} rx={13} ry={8} fill="#6b5238" transform="rotate(18 166 98)" />
      <Eye x={134} y={98} r={6} look={0} />
      <Eye x={166} y={98} r={6} look={0} />
      <Nose x={150} y={110} r={6} />
      <Smile x={150} y={118} w={16} />
    </Svg>
  );
}

export function Tatu() {
  return (
    <Svg>
      <Ground rx={110} />
      <C d="M238 262C262 262 282 250 290 236C280 260 262 274 238 274Z" c="armadillo" />
      <C d={rrect(92, 250, 22, 34, 10)} c="armadillo" />
      <C d={rrect(200, 250, 22, 34, 10)} c="armadillo" />
      <C d="M70 264C70 170 240 170 244 264Z" c="armadillo" />
      <Line
        d="M100 262C104 214 118 196 132 188M130 262C132 212 140 196 150 186M160 262C160 212 164 196 170 188M190 262C188 214 184 198 186 192M216 262C212 222 206 206 204 198"
        color="rgb(110 80 60 / 0.4)"
        w={4}
      />
      <Sheen cx={130} cy={200} rx={34} ry={12} o={0.5} />
      <C d={ell(66, 228, 34, 28)} c="armadillo" />
      <C d={ell(30, 240, 20, 13)} c="armadillo" />
      <Nose x={14} y={238} r={5} />
      <C d={leafPath(38, 14)} c="armadillo" t="translate(80 206) rotate(-10)" />
      <C d={leafPath(26, 8)} c="pink" t="translate(80 204) rotate(-10)" />
      <Eye x={56} y={222} r={8} />
      <Cheek x={50} y={246} r={8} />
    </Svg>
  );
}
