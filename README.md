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
| Cenários desenhados em massinha (SVG) | `src/art/` |
| Imagens e áudios finais | `public/assets/` (veja o `README.md` de lá) |

Se uma imagem ou um mp3 não existir, o jogo usa um desenho ou a voz do aparelho no lugar, então dá
para trocar a arte aos poucos.

## Áudio

As falas foram geradas com a voz "Letícia" da ElevenLabs e salvas como mp3 em `public/assets/`. O jogo
só toca os arquivos: não chama nenhum serviço enquanto se joga. Se mudar um texto, o mp3 precisa ser
gerado de novo.

## Telas

O jogo ocupa a tela inteira em qualquer proporção: em telas largas mostra mais cenário para os lados,
em telas mais quadradas mostra mais céu, e no celular em pé pede para girar o aparelho.
