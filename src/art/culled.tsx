import { culled } from './cull';
import * as base from './props';
import * as forest from './forestProps';
import * as desert from './desertProps';
import * as beach from './beachProps';

// Os objetos de cenário usados nas faixas longas, com a versão que só existe perto da tela.
// (As cenas importam daqui; telas pequenas, como a de carregando, usam os objetos direto.)

export const Cloud = culled(base.Cloud);
export const Sun = culled(base.Sun);
export const Rock = culled(base.Rock);
export const Pebble = culled(base.Pebble);
export const Flower = culled(base.Flower);
export const Plant = culled(base.Plant);
export const Grass = culled(base.Grass);
export const PuffTree = culled(base.PuffTree);
export const Pine = culled(base.Pine);
export const Log = culled(base.Log);
export const Signpost = culled(base.Signpost);
export const Foam = culled(base.Foam);
export const Palm = culled(base.Palm);

export const Fern = culled(forest.Fern);
export const Clover = culled(forest.Clover);
export const TwistedTree = culled(forest.TwistedTree);
export const RockSpires = culled(forest.RockSpires);
export const Waterfall = culled(forest.Waterfall);
export const WoodFence = culled(forest.WoodFence);
export const LogBridge = culled(forest.LogBridge);

export const Saguaro = culled(desert.Saguaro);
export const Barrel = culled(desert.Barrel);
export const Agave = culled(desert.Agave);
export const Mesa = culled(desert.Mesa);
export const Spire = culled(desert.Spire);
export const Boulder = culled(desert.Boulder);
export const Oasis = culled(desert.Oasis);

export const Shell = culled(beach.Shell);
export const Conch = culled(beach.Conch);
export const Coral = culled(beach.Coral);
export const Islet = culled(beach.Islet);
export const Lighthouse = culled(beach.Lighthouse);
export const Cliff = culled(beach.Cliff);
export const IcePlant = culled(beach.IcePlant);
export const BarnacleRock = culled(beach.BarnacleRock);
export const TidePool = culled(beach.TidePool);
export const RopeFence = culled(beach.RopeFence);
export const Footprints = culled(beach.Footprints);
