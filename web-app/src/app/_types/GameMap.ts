import {Character} from './Character';
import {Cell} from './Cell';
import {Color} from './Color';
export class GameMap {
  constructor(mapData?: Partial<GameMap>) {
    if (mapData) {
      if (!mapData.name) {
        this.name = 'Tropeville';
      }
    }
    Object.assign(this, mapData);
  }

  name: string;
  cellList?: Cell[];
  cells?: object;
  game?: string;
  characters?: Character[];
  sizeX: number;
  sizeY: number;

  resetMap(): void {
    const cellsObject: object = {};
    const cellList: Cell[] = [];
    let i, j: number;
    for (i = 0; i < this.sizeY; i++) {
      for (j = 0; j < this.sizeX; j++) {
        cellsObject[j + ',' + i] = (new Cell(j, i, new Color(3, 3, 3), 1));
      }
    }
    this.cells = cellsObject;
  }
}
