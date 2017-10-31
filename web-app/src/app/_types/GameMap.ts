import {Character} from './Character';
import {Cell} from './Cell';
export class GameMap {
  constructor(mapData?: Partial<GameMap>) {
    if (mapData && !mapData.name) {
      this.name = 'Tropeville';
    }
    Object.assign(this, mapData);
  }

  name: string;
  cellstring?: string;
  cells?: Cell[];
  game?: string;
  characters?: Character[];
  sizeX: number;
  sizeY: number;

  parseCellList(): Cell[] {
    if (this.cellstring) {
      return JSON.parse(this.cellstring);
    }
    return null;
  }

  updateCellString(cellList: Cell[]): void {
    this.cellstring = JSON.stringify(cellList);
  }
}
