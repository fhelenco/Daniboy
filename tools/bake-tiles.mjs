// Gera as imagens do cenário (public/assets/tiles/<tamanho>/<lugar>/L<camada>-<n>.webp) a partir do desenho em SVG.
// Dois tamanhos: m (celular) e g (computador/tablet); veja src/data/tiles.ts. Depois de gerar, coloque o lugar em BAKED_ENVS.
//
// Como usar (o puppeteer-core NÃO faz parte do projeto; instale só para rodar isto):
//   npm i --no-save puppeteer-core
//   npm run dev            # em outro terminal
//   node tools/bake-tiles.mjs [http://localhost:5173] [floresta,deserto,oceano]
//
// Precisa do Google Chrome instalado (ou CHROME=/caminho/do/chrome). Depois de mudar a arte de uma cena
// (src/art/scenes) ou a posição de um bicho, rode de novo. TIER=g gera só o tamanho g (ou m).
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:5173';
const only = (process.argv[3] || 'floresta,deserto,oceano').split(',');
const OUT = 'public/assets/tiles';
const TIERS = { m: 1.5, g: 2.2 }; // igual a TILE_SCALES em src/data/tiles.ts
const QUALITY = 82;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
let total = 0;
for (const env of only) {
  for (const tier of Object.keys(TIERS)) mkdirSync(`${OUT}/${tier}/${env}`, { recursive: true });
  for (const layer of [1, 2, 3, 4, 5]) {
    await page.setViewport({ width: 1100, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${base}/bake.html?env=${env}&layer=${layer}`, { waitUntil: 'load' });
    await page.waitForFunction('window.__ready === true', { timeout: 60000 });
    const count = await page.evaluate('window.__count');
    for (const [tier, scale] of Object.entries(TIERS).filter(([t]) => !process.env.TIER || t === process.env.TIER)) {
      await page.setViewport({ width: 1100, height: 900, deviceScaleFactor: scale });
      for (let k = 0; k < count; k++) {
        await page.evaluate((k) => window.__setTile(k), k);
        await page.waitForFunction('window.__ready === true', { timeout: 60000 });
        const el = await page.$('#tile');
        await el.screenshot({ path: `${OUT}/${tier}/${env}/L${layer}-${k}.webp`, type: 'webp', quality: QUALITY, omitBackground: true });
        total++;
      }
    }
    process.stdout.write(`${env} camada ${layer}: ${count} peças x 2 tamanhos\n`);
  }
}
console.log(`pronto: ${total} imagens em ${OUT}`);
await browser.close();
