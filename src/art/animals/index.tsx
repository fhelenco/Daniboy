import type { ComponentType } from 'react';
import type { Animal } from '../../data/types';
import { ClayImage } from '../../components/ClayImage';
import { ClayBlob } from '../../placeholders/ClayBlob';
import { Camelo, Coruja, Feneco, Lagarto, Suricato } from './desert';
import { Capivara, Macaco, Preguica, Tatu, Tucano } from './forest';
import { Baleia, Caranguejo, Estrela, Golfinho, Tartaruga } from './ocean';

// Desenho placeholder de cada bicho, pelo id usado em data/animals.ts.
const ART: Record<string, ComponentType> = {
  capivara: Capivara,
  tucano: Tucano,
  macaco: Macaco,
  preguica: Preguica,
  tatu: Tatu,
  camelo: Camelo,
  feneco: Feneco,
  suricato: Suricato,
  lagarto: Lagarto,
  coruja: Coruja,
  caranguejo: Caranguejo,
  tartaruga: Tartaruga,
  golfinho: Golfinho,
  estrela: Estrela,
  baleia: Baleia,
};

/** O PNG do bicho, se existir; senão o desenho em massinha; senão um bichinho genérico. */
export function AnimalArt({ animal, className = 'h-full w-full' }: { animal: Animal; className?: string }) {
  const Art = ART[animal.id];
  return (
    <ClayImage
      src={animal.image}
      alt={animal.name}
      className={`${className} object-contain`}
      fallback={Art ? <Art /> : <ClayBlob seed={animal.id} className={className} />}
    />
  );
}
