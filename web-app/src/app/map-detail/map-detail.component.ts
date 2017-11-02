// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators} from '@angular/forms';
import 'rxjs/add/operator/switchMap';

// Authored
import {MapService} from '../_services/map.service';
import {GameMap} from '../_types/GameMap';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Cell} from '../_types/Cell';
import {Color} from '../_types/Color';
import {Item} from '../_types/Item';
import {PaletteDialogComponent} from './palette-dialog/palette-dialog.component';
import {CharacterService} from '../_services/character.service';

// AngularFire2
import {AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css'],
})
export class MapDetailComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  map: GameMap;
  stats: string[];
  columns = 0;
  mapRef: AngularFireObject<GameMap>;
  mapData: Observable<GameMap>;
  cellsRef: AngularFireList<Cell>;
  cellList: Observable<any[]>;
  terrainRefList: AngularFireList<any>;
  terrainList: Observable<any[]>;
  itemRef: AngularFireList<Item>;
  itemList: Observable<any[]>;
  selectedAsset: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // load map data
      const name = params.get('name');
      this.mapRef = this.mapService.getMapRef(name);
      this.mapData = this.mapRef.valueChanges();
      this.mapData.subscribe(rData => {
        this.initMap(rData);
      });

      this.cellsRef = this.mapService.getCellsRef(name);
      this.cellList = this.cellsRef.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
    });
    // load terrain data
    this.terrainRefList = this.mapService.getPublicTerrainReferenceList();
    this.terrainList = this.terrainRefList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

  }


  initMap(mapData: GameMap): void {
    this.map = new GameMap(mapData);
    this.columns = this.map.sizeX;
  }

  saveMap(): void {
    this.mapRef.update(this.map)
      .then(success => {
        this.snackbar.open('Success!', '', {duration: 2000});
      })
      .catch(fail => {
        this.snackbar.open('Something went wrong', '', {duration: 2000});
      });
  }


  saveCell(key: string, cellData: Cell): void {
    console.log(key, cellData);
    this.cellsRef.update(key, cellData);
  }

  cellSelect(cell: Cell, key: string) {
    // Open dialog for celldata
    const dRef = this.dialog.open(
      PaletteDialogComponent,
      { width: '75vw'}
    );
    // set celldata then save cell
    dRef.afterClosed().subscribe(cellData => {
      if (cellData) {
        this.cellsRef.update(key, {
          'cost': cellData.cost,
          'color': {
            'red': cellData.red,
            'green': cellData.green,
            'blue': cellData.blue
          },
          'coordX': cell.coordX,
          'coordY': cell.coordY
        });
      }
    });
  }

  toggleBrush(asset: any, assetType: string) {
    // if the asset is the same as selected, clear it and return
    if (asset === this.selectedAsset) {
      this.selectedAsset = null;
      return;
    }
    this.selectedAsset = asset;
    console.log(this.selectedAsset);
  }

  getCellColor(color: Color): string {
    const scale = 4;
    const red = (color.red * scale).toString(16);
    const green = (color.green * scale).toString(16);
    const blue = (color.blue * scale).toString(16);
    return ('#' + red + green + blue);
  }

  getTerrainColor(red: number, green: number, blue: number): string {
    const scale = 4;
    const redHex = (red * scale).toString(16);
    const greenHex = (green * scale).toString(16);
    const blueHex = (blue * scale).toString(16);
    return ('#' + redHex + greenHex + blueHex);
  }
}
