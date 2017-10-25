// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Authored assets
import {MapService} from '../_services/map.service';
import {GameMap} from '../_types/GameMap';
import {NewMapComponent} from './new-map/new-map.component';
import {DeleteMapComponent} from './delete-map/delete-map.component';

@Component({
  selector: 'map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.css'],
})
export class MapListComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  currentMap: GameMap;
  myMaps: any;

  onSelect(map: GameMap): void {
    if (this.currentMap !== map) {
      this.currentMap = map;
    } else {
      this.currentMap = null;
    }
  }
  ngOnInit(): void {
    if (!this.myMaps) {
      this.getMaps();
    }
  }
  getMaps(): void {
    this.myMaps = this.mapService.getMapObservableList();
  }
  gotoDetail(): void {
    this.router.navigate(['/myMaps', this.currentMap.name]);
  }
  createMap(): void {
    // Open dialog for name
    const dRef = this.dialog.open(NewMapComponent, { width: '37rem'});
    // navigate to new character sheet
    dRef.afterClosed().subscribe(name => {
      if (name && name !== '') {
        this.router.navigate(['/myMaps', name]);
      }
    });
  }
  deleteMap(): void {
    // Open dialog for confirmation
    const dRef = this.dialog.open(DeleteMapComponent, { width: '37rem', data: { name: this.currentMap.name }});
    dRef.afterClosed().subscribe( confirm => {
      if (confirm) {
        this.currentMap = null;
      }
    });
  }
}
