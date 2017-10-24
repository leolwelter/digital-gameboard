import {Character} from './Character';
import {Cell} from './Cell';
export class GameMap {
  constructor(mapData?: Partial<GameMap>) {
    if (mapData && !mapData.name) {
      this.name = 'Tropeville';
    }
    Object.assign(this, mapData);
    console.log(this);
  }

  name: string;
  cells?: Cell[];
  game?: string; // gameId
  characters?: Character[];
  sizeX: number;
  sizeY: number;
}
