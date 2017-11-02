import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {MapService} from '../../_services/map.service';
import {CharacterService} from '../../_services/character.service';
import {Observable} from 'rxjs/Observable';
import {AngularFireList} from 'angularfire2/database';
import {Color} from '../../_types/Color';

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
    // TODO: this.players = playerService.getPlayerCharacterObservableList();
    // TODO: this.monsters = monsterService.getMonsterObservableList();
    // TODO: this.items = itemService.getItemObservableList();
    this.terrainRefList = mapService.getPublicTerrainReferenceList();
    this.terrainList = this.terrainRefList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  players: Observable<any[]>;
  monsters: Observable<any[]>;
  items: Observable<any[]>;
  terrainRefList: AngularFireList<any>;
  terrainList: Observable<any[]>;

  onSelect(terrain: object) {
    this.dialogRef.close(terrain);
  }

  getTerrainColor(red: number, green: number, blue: number): string {
    const scale = 4;
    const redHex = (red * scale).toString(16);
    const greenHex = (green * scale).toString(16);
    const blueHex = (blue * scale).toString(16);
    return ('#' + redHex + greenHex + blueHex);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
