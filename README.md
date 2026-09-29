# Daniboy

Jogo web para uma criança de 5 anos que ainda não lê. O Daniboy, um menino de massinha, caminha por
lugares (floresta, deserto e oceano), encontra animais e ouve uma narração sobre cada um. Tudo tem
ícone e voz; não há pontuação, tempo nem "game over".

Feito com Vite + React + TypeScript + Tailwind + Motion. Sem contas, anúncios, análise de uso nem
links externos.

## Como rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão para publicar em dist/
```

Na trilha: segure o botão laranja (ou a tecla →) para andar e o azul (ou ←) para voltar.

## Onde mexer

| O que | Onde |
|---|---|
| Lugares e camadas do cenário | `src/data/environments.ts` |
| Animais e textos das narrações | `src/data/animals.ts` |
| Falas fixas do jogo | `src/audio/lines.ts` |
| Imagens do Daniboy e ciclo da caminhada | `src/data/daniboy.ts` |
| Cenários e bichos desenhados em massinha/pelúcia (SVG) | `src/art/` |
| Botões de biscoito, ícones e placas de madeira, molduras, livro e barra | `src/components/BigButton.tsx`, `icons.tsx`, `wood.tsx` |
| Imagens e áudios finais | `public/assets/` (veja o `README.md` de lá) |

Se uma imagem ou um mp3 não existir, o jogo usa um desenho ou a voz do aparelho no lugar, então dá
para trocar a arte aos poucos.

## Áudio

As falas foram geradas com a voz "Letícia" da ElevenLabs e salvas como mp3 em `public/assets/`. O jogo
só toca os arquivos: não chama nenhum serviço enquanto se joga. Se mudar um texto, o mp3 precisa ser
gerado de novo.

## Visual

Os botões são discos de biscoito com ícone creme em relevo; placas, molduras de card, o livro do álbum
e a barra de carregamento são de madeira com folhinhas (`src/components/wood.tsx`). As figurinhas do
álbum são recortadas (contorno branco, classe `.diecut` em `src/styles/index.css`) e as que faltam
aparecem como silhueta cinza com "?". Os bichos têm olhos grandes e brilhantes e borda de feltro
(filtro `#fuzz`). O Daniboy é sempre a arte própria dele, nunca desenhada em SVG.

## Telas

O jogo ocupa a tela inteira em qualquer proporção: em telas largas mostra mais cenário para os lados,
em telas mais quadradas mostra mais céu, e no celular em pé pede para girar o aparelho. O cenário vai
até as bordas (inclusive por baixo do notch); só os botões respeitam a área segura (`safe` em
`src/components/Stage.tsx`).

## No celular

Para abrir como app, sem a barra do navegador: no Safari, Compartilhar → "Adicionar à Tela de Início"
(`public/manifest.webmanifest`, ícones em `public/icons/`). O jogo em si ainda não funciona sem internet.

## Desempenho

As faixas do cenário têm mais de 10 000 unidades de largura, mas só ~2 000 aparecem por vez: cada objeto
só existe no DOM quando está perto da tela (`src/art/cull.tsx`; as cenas importam de `src/art/culled.tsx`).
O Daniboy carrega em 768×1152 e o resto só na tela de carregando.

Modo leve para diagnóstico: abrir com `?leve` no endereço (ex.: `https://…/?leve`) desliga o grão de
massinha e o feltro dos bichos. Se o jogo só travar sem `?leve`, o problema é a memória gasta por esses efeitos.

Atenção: não use `will-change`/`translate3d` nas faixas do cenário. Cada uma tem mais de 10 000 de largura
e, promovida a camada própria, é a causa provável de o Safari do iPhone ter derrubado a página ao entrar
num lugar (ela recarregava sozinha, voltando ao início).
