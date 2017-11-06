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
    let i, j: number;
    let cnt = 0;
    this.cells = cellsObject;
    for (j = 0; j < this.sizeY; j++) {
      for (i = 0; i < this.sizeX; i++) {
        cellsObject[j + ',' + i] = (new Cell(j, i, new Color(0, 2, 0), 1));
        cellsObject[j + ',' + i].order = cnt;
        cnt++;
      }
    }
  }
}
