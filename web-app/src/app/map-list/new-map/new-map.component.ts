import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { GameMap } from '../../_types/GameMap';
import { MapService } from '../../_services/map.service';

@Component({
  selector: 'new-map',
  templateUrl: 'new-map.component.html',
})
export class NewMapComponent {
  constructor(
    private mapService: MapService,
    public dialogRef: MatDialogRef<NewMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  name: string;
  dimensionX: number;
  dimensionY: number;

  onNoClick(): void {
    this.dialogRef.close(false);
  }


  createMap() {
    const map = new GameMap({
      'name': this.name,
      'sizeX': this.dimensionX,
      'sizeY': this.dimensionY
    });
    this.mapService.createMap(map)
      .then(() => {
        this.dialogRef.close(map.name);
      })
      .catch(() => {
        this.dialogRef.close(false);
      });
  }
}
