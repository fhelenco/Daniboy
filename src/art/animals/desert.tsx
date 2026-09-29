import { C, Line, S } from '../Clay';
import { blob, ell, leafPath, rrect } from '../geom';
import { Cheek, Eye, Ground, Nose, Smile, Svg } from './parts';

export function Camelo() {
  return (
    <Svg>
      <Ground rx={110} />
      <C d={rrect(212, 196, 20, 88, 10)} c="camel" />
      <C d={rrect(118, 196, 20, 88, 10)} c="camel" />
      <S d="M258 170Q272 190 264 214" c="camel" w={8} />
      <C d={blob(180, 176, 82, 46, 17, 0.04)} c="camel" />
      <C d={ell(154, 134, 32, 34)} c="camel" />
      <C d={ell(212, 136, 30, 32)} c="camel" />
      <C d={rrect(234, 200, 20, 86, 10)} c="camel" />
      <C d={rrect(138, 200, 20, 86, 10)} c="camel" />
      {[128, 148, 222, 244].map((x) => (
        <C key={x} d={ell(x, 284, 13, 6)} c="trunk" />
      ))}
      <S d="M112 176C92 164 80 140 76 106" c="camel" w={36} />
      <C d={ell(70, 92, 32, 24)} c="camel" />
      <C d={ell(42, 102, 22, 17)} c="camel" />
      <C d={ell(86, 70, 8, 11)} c="camel" />
      <Eye x={66} y={86} r={8} />
      <Line d="M58 76l-4 -5M64 74l-1 -6M70 75l2 -6" color="#5a3a22" w={2} />
      <Nose x={28} y={98} r={3} />
      <Smile x={40} y={110} w={14} />
      <Cheek x={58} y={106} r={8} />
    </Svg>
  );
}

export function Feneco() {
  return (
    <Svg>
      <Ground rx={90} />
      <C d={blob(226, 244, 52, 24, 3, 0.05)} c="fennec" t="rotate(-20 226 244)" />
      <C d={ell(268, 226, 16, 12)} c="petal" />
      <C d={blob(158, 222, 50, 58, 5, 0.04)} c="fennec" />
      <C d={blob(150, 234, 28, 38, 6, 0.05)} c="petal" />
      <C d={ell(132, 280, 16, 9)} c="fennec" />
      <C d={ell(170, 280, 16, 9)} c="fennec" />
      <C d={leafPath(100, 40)} c="fennec" t="translate(120 122) rotate(-28)" />
      <C d={leafPath(70, 22)} c="pink" t="translate(120 116) rotate(-28)" />
      <C d={leafPath(100, 40)} c="fennec" t="translate(172 120) rotate(24)" />
      <C d={leafPath(70, 22)} c="pink" t="translate(172 114) rotate(24)" />
      <C d={ell(146, 150, 44, 38)} c="fennec" />
      <C d={ell(128, 168, 26, 17)} c="petal" />
      <Nose x={108} y={162} r={6} />
      <Eye x={130} y={144} r={10} />
      <Eye x={164} y={144} r={10} />
      <Smile x={124} y={176} w={14} />
      <Cheek x={174} y={166} />
    </Svg>
  );
}

export function Suricato() {
  return (
    <Svg>
      <Ground rx={70} />
      <S d="M176 260Q214 268 226 240" c="meerkat" w={12} />
      <C d={blob(150, 196, 40, 80, 9, 0.04)} c="meerkat" />
      <C d={blob(146, 208, 24, 58, 10, 0.05)} c="face" />
      <C d={ell(134, 280, 16, 8)} c="meerkat" />
      <C d={ell(166, 280, 16, 8)} c="meerkat" />
      <S d="M122 150Q116 172 134 176" c="meerkat" w={14} />
      <S d="M176 150Q182 172 164 176" c="meerkat" w={14} />
      <C d={ell(118, 86, 8)} c="dark" />
      <C d={ell(182, 86, 8)} c="dark" />
      <C d={ell(150, 96, 36, 34)} c="meerkat" />
      <C d={ell(124, 110, 22, 15)} c="meerkat" />
      <ellipse cx={138} cy={94} rx={12} ry={10} fill="#6b5238" />
      <ellipse cx={166} cy={94} rx={12} ry={10} fill="#6b5238" />
      <Eye x={138} y={94} r={8} />
      <Eye x={166} y={94} r={8} />
      <Nose x={104} y={108} r={5} />
      <Smile x={120} y={120} w={12} />
    </Svg>
  );
}

export function Lagarto() {
  return (
    <Svg>
      <Ground rx={120} />
      <C d={blob(170, 252, 110, 40, 3, 0.08)} c="boulder" />
      <C d="M226 198C266 202 294 226 280 262C286 236 262 216 228 220Z" c="lizard" />
      <S d="M210 214Q226 232 214 240" c="lizard" w={14} />
      <C d={ell(168, 204, 70, 26)} c="lizard" />
      {[130, 150, 170, 190, 210].map((x) => (
        <C key={x} d={ell(x, 181, 7, 6)} c="pollen" />
      ))}
      {[[146, 204], [180, 198], [206, 210]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={6} fill="#bdea86" />
      ))}
      <S d="M120 216Q106 232 118 240" c="lizard" w={14} />
      <S d="M198 222Q194 236 204 242" c="lizard" w={13} />
      <C d={ell(92, 188, 38, 26)} c="lizard" />
      <Eye x={84} y={176} r={10} />
      <Smile x={70} y={198} w={20} />
      <Cheek x={100} y={200} r={8} />
    </Svg>
  );
}

export function Coruja() {
  return (
    <Svg>
      <ellipse cx={150} cy={284} rx={80} ry={16} fill="#6b4a2e" opacity={0.5} />
      <Ground rx={60} />
      <C d={rrect(132, 236, 9, 46, 4)} c="dryGrass" />
      <C d={rrect(160, 236, 9, 46, 4)} c="dryGrass" />
      <C d={ell(136, 282, 12, 5)} c="dryGrass" />
      <C d={ell(166, 282, 12, 5)} c="dryGrass" />
      <C d={blob(150, 178, 56, 74, 3, 0.04)} c="owl" />
      <C d={blob(150, 202, 36, 46, 4, 0.05)} c="face" />
      {[[136, 196], [162, 206], [146, 222], [170, 186]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx={5} ry={3.5} fill="#b08a5d" opacity={0.6} />
      ))}
      <C d={leafPath(90, 26)} c="owl" t="translate(104 136) rotate(190)" />
      <C d={leafPath(90, 26)} c="owl" t="translate(196 136) rotate(170)" />
      {[[120, 96], [150, 88], [178, 98], [132, 76], [166, 78]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={3} fill="#fff" opacity={0.8} />
      ))}
      <C d={ell(130, 136, 20)} c="petal" />
      <C d={ell(170, 136, 20)} c="petal" />
      <C d={ell(130, 136, 14)} c="eyeYellow" grain={false} />
      <C d={ell(170, 136, 14)} c="eyeYellow" grain={false} />
      <circle cx={128} cy={137} r={7} fill="#1e1a1c" />
      <circle cx={168} cy={137} r={7} fill="#1e1a1c" />
      <circle cx={125} cy={133} r={2.6} fill="#fff" />
      <circle cx={165} cy={133} r={2.6} fill="#fff" />
      <S d="M110 114Q128 104 146 114" c="petal" w={8} />
      <S d="M154 114Q172 104 190 114" c="petal" w={8} />
      <C d="M143 152L157 152L150 168Z" c="pollen" />
    </Svg>
  );
}
