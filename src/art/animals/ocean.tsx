import { C, Line, S, Sheen } from '../Clay';
import { blob, ell, leafPath, rrect, softStar } from '../geom';
import { Foam } from '../props';
import { Cheek, Eye, Ground, Smile, Svg } from './parts';

export function Caranguejo() {
  return (
    <Svg>
      <Ground rx={110} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <S d={`M${112 - i * 4} ${228 + i * 10}Q${72 - i * 6} ${232 + i * 12} ${64 - i * 4} ${270 + i * 4}`} c="crab" w={9} />
          <S d={`M${188 + i * 4} ${228 + i * 10}Q${228 + i * 6} ${232 + i * 12} ${236 + i * 4} ${270 + i * 4}`} c="crab" w={9} />
        </g>
      ))}
      <S d="M112 206Q80 196 70 170" c="crab" w={14} />
      <S d="M188 206Q220 196 230 170" c="crab" w={14} />
      <C d={ell(52, 132, 16, 12)} c="crab" t="rotate(-24 52 132)" />
      <C d={ell(66, 156, 26, 22)} c="crab" />
      <C d={ell(248, 132, 16, 12)} c="crab" t="rotate(24 248 132)" />
      <C d={ell(234, 156, 26, 22)} c="crab" />
      <C d={blob(150, 222, 72, 44, 5, 0.04)} c="crab" />
      <Sheen cx={128} cy={202} rx={30} ry={12} o={0.5} />
      <C d={rrect(124, 152, 9, 44, 4)} c="crab" />
      <C d={rrect(167, 152, 9, 44, 4)} c="crab" />
      <Eye x={128} y={150} r={13} />
      <Eye x={171} y={150} r={13} />
      <Smile x={150} y={228} w={26} />
      <Cheek x={112} y={226} r={10} />
      <Cheek x={188} y={226} r={10} />
    </Svg>
  );
}

export function Tartaruga() {
  return (
    <Svg>
      <Ground rx={120} />
      <C d={leafPath(60, 22)} c="turtleSkin" t="translate(226 256) rotate(120)" />
      <C d={leafPath(70, 26)} c="turtleSkin" t="translate(104 256) rotate(-120)" />
      <C d="M240 250L264 256L240 262Z" c="turtleSkin" />
      <C d="M72 256C72 164 232 164 236 256Z" c="turtleShell" />
      <C d={blob(152, 206, 30, 24, 2, 0.08)} c="leafLight" />
      <C d={blob(108, 232, 20, 16, 3, 0.1)} c="leafLight" />
      <C d={blob(196, 232, 22, 16, 4, 0.1)} c="leafLight" />
      <C d={rrect(66, 248, 176, 16, 8)} c="turtleShell" />
      <C d={ell(50, 222, 34, 28)} c="turtleSkin" />
      <Eye x={42} y={214} r={9} />
      <Smile x={34} y={234} w={14} />
      <Cheek x={58} y={236} r={8} />
    </Svg>
  );
}

export function Golfinho() {
  return (
    <Svg>
      <C d={blob(150, 274, 130, 20, 3, 0.06)} c="sea" />
      <g transform="rotate(24 150 160)">
        <C d="M150 122C160 96 176 88 190 86C182 100 180 112 184 126Z" c="dolphin" />
        <C d="M240 160C260 150 270 132 286 124C282 144 276 156 262 164C276 172 282 184 286 200C270 192 260 176 240 168Z" c="dolphin" />
        <C d={ell(150, 160, 100, 40)} c="dolphin" />
        <C d={ell(140, 178, 72, 17)} c="belly" />
        <C d={ell(48, 170, 24, 12)} c="dolphin" />
        <C d="M120 188C128 206 144 214 156 214C150 204 146 194 144 186Z" c="dolphin" />
        <Eye x={92} y={152} r={8} />
        <Smile x={62} y={176} w={20} />
        <Cheek x={98} y={172} r={8} />
      </g>
      <Foam x={40} y={264} w={220} seed={5} />
      <C d={ell(248, 222, 7)} c="foam" />
      <C d={ell(262, 204, 5)} c="foam" />
      <C d={ell(60, 238, 6)} c="foam" />
    </Svg>
  );
}

export function Estrela() {
  const dots = [0, 1, 2, 3, 4].flatMap((k) =>
    [42, 66, 88].map((r, j) => {
      const a = ((-90 + k * 72) * Math.PI) / 180;
      return <circle key={`${k}-${j}`} cx={150 + Math.cos(a) * r} cy={196 + Math.sin(a) * r} r={6 - j * 1.4} fill="#ffe2ac" opacity={0.85} />;
    }),
  );
  return (
    <Svg>
      <Ground rx={100} />
      <g transform="rotate(-8 150 196)">
        <C d={softStar(150, 196, 110, 52)} c="star" />
        {dots}
        <Eye x={134} y={188} r={10} />
        <Eye x={166} y={188} r={10} />
        <Smile x={150} y={208} w={20} />
        <Cheek x={120} y={208} />
        <Cheek x={180} y={208} />
      </g>
    </Svg>
  );
}

export function Baleia() {
  return (
    <Svg>
      <S d="M100 142C94 112 98 82 100 58" c="#bfe9ff" w={12} />
      <C d={ell(100, 48, 16, 12)} c="foam" />
      <C d={ell(80, 58, 12, 10)} c="foam" />
      <C d={ell(120, 58, 12, 10)} c="foam" />
      <C d={ell(66, 76, 7)} c="foam" />
      <C d={ell(134, 78, 7)} c="foam" />
      <S d="M236 196Q262 180 268 150" c="whale" w={26} />
      <C d={leafPath(52, 18)} c="whale" t="translate(268 152) rotate(-52)" />
      <C d={leafPath(52, 18)} c="whale" t="translate(268 152) rotate(40)" />
      <C d={blob(150, 200, 116, 62, 5, 0.03)} c="whale" />
      <C d="M50 214C92 262 214 266 262 222C214 244 104 244 50 214Z" c="belly" />
      <Line d="M80 232Q150 254 230 232M92 242Q150 260 216 244" color="rgb(80 110 160 / 0.3)" w={2.5} />
      <C d={leafPath(48, 18)} c="whale" t="translate(122 232) rotate(-150)" />
      <Eye x={78} y={196} r={9} />
      <Smile x={62} y={218} w={30} />
      <Cheek x={94} y={214} r={9} />
      <C d={blob(150, 272, 140, 20, 7, 0.05)} c="sea" />
      <Foam x={30} y={260} w={240} seed={11} />
    </Svg>
  );
}
