import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {MapService} from '../../_services/map.service';
import {CharacterService} from '../../_services/character.service';

@Component({
  selector: 'palette-dialog',
  templateUrl: 'palette-dialog.component.html',
  styleUrls: ['palette-dialog.component.css']
})
export class PaletteDialogComponent {
  constructor(
    public mapService: MapService,
    public characterService: CharacterService,
    public dialogRef: MatDialogRef<PaletteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.items = ['1', '2', '3'];
  }

  items: any[];

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
