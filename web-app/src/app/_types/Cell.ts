import {Color} from './Color';

export class Cell {
  constructor(coordX?: number, coordY?: number, color?: Color, cost?: number) {
    this.coordX = coordX;
    this.coordY = coordY;
    this.color = color;
    this.cost = cost;
  }

  coordX: number;
  coordY: number;
  color: Color;
  cost: number;
  creature: string; // Character or Monsters
  // items: Item[]; // TODO

}
