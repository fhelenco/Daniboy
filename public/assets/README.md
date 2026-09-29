# Arte e áudio

Os caminhos vêm de `src/data/`. Basta colocar o arquivo com o nome certo aqui para
ele substituir o desenho placeholder. Se um arquivo não existir, o jogo segue normalmente:

- imagem faltando: aparece o desenho em massinha (SVG)
- mp3 faltando: a voz do aparelho lê o texto em português

## daniboy/ (fundo transparente, 1024×1536)
- acenando.webp: de frente, acenando (início, escolher lugar, quando ri)
- andando.webp: de lado, parado no meio do passo (quando ele para)
- andando-1.webp … andando-13.webp: os 13 quadros de UM passo, na ordem do ciclo definido em
  src/data/daniboy.ts (8 → 10 → 9 → 3 → 4 → 13 → 11 → 1 → 12 → 2 → 5 → 6 → 7). Os quadros 8, 10 e 9
  são as pernas se cruzando. O quadro troca conforme a distância andada, nas duas direções
  (voltando, a imagem é espelhada).
- andando-extra-b.webp, andando-extra-c.webp, andando-esquerda.webp: guardadas, fora do ciclo
  (não encaixam na passada; a última é ele andando virado para a esquerda).
- curioso.webp: inclinado, olhando para a direita (o instante em que ele chega perto do bicho)
- agachado.webp: agachado olhando para a direita (esperando o toque no bicho)
- pulando.webp: pulando de braços abertos (quando toca nele e na festa)
- comemorando.webp, feliz.webp: punho para cima / braços para cima (a festa alterna as três)
- costas.webp, costas-andando.webp: de costas, dois passos (no fim da trilha ele vai embora)
- costas-parado.webp, olhando-atras.webp: ainda não usadas no jogo
- abaixado.webp: versão antiga do agachado (olhava para a esquerda). Não é mais usada.

## forest/, desert/, ocean/
- capa.webp: imagem do card na tela "escolher lugar".
- Cenário da trilha: 6 camadas que andam em velocidades diferentes. Hoje são desenhadas
  em massinha pelo jogo (src/art/scenes/). Para trocar por arte pronta, crie PNGs de
  1600×900 que emendem na horizontal (a borda direita continua na esquerda), fundo
  transparente (menos o céu):
  camada-ceu.png, camada-longe.png, camada-meio.png, camada-perto.png,
  camada-chao.png (a trilha: os pés do Daniboy ficam em y≈790) e camada-frente.png
  (plantas/pedras que passam na frente dele).
- um PNG e um mp3 por bicho, com o id do bicho: capivara.png / capivara.mp3 etc.
  (floresta: capivara, tucano, macaco, preguica, tatu;
   deserto: camelo, feneco, suricato, lagarto, coruja;
   oceano: caranguejo, tartaruga, golfinho, estrela, baleia)
  Bicho de massinha, de corpo inteiro, olhando para a ESQUERDA, fundo transparente, quadrado.
- nome.mp3: o nome do lugar falado

## voice/ (falas do jogo)
- boas-vindas.mp3: "Oi, Daniel! Vamos passear?"
- escolher-lugar.mp3: "Para onde vamos hoje?"
- todos.mp3: "Você conheceu todos!"
- album.mp3: "Esse é o seu álbum, Daniel! Toque nas figurinhas para ouvir de novo."
- escondido.mp3: "Esse amiguinho ainda está escondido. Vamos procurar?"

## ../referencias/ (fora do jogo)
Ilustrações usadas como referência de estilo para desenhar os cenários.
