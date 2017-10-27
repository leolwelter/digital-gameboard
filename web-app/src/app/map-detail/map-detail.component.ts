// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators} from '@angular/forms';
import 'rxjs/add/operator/switchMap';

// Authored
import {MapService} from '../_services/map.service';
import {GameMap} from '../_types/GameMap';

// AngularFire2
import {AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';
import {Cell} from '../_types/Cell';
import {Color} from "../_types/Color";


@Component({
  selector: 'map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css'],
})
export class MapDetailComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar,
  ) {}
  map: GameMap;
  mapRef: AngularFireObject<GameMap>;
  mapData: Observable<GameMap>;
  cellList: Cell[];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      this.mapRef = this.mapService.getMapRef(name);
      this.mapData = this.mapRef.valueChanges();
      this.mapData.subscribe(mapData => {
        this.initMap(mapData);
      });
    });
  }


  initMap(mapData: GameMap): void {
    this.map = new GameMap(mapData);
    this.cellList = this.map.parseCellList();
    console.log(this.cellList);
  }

  saveMap(): void {
    this.map.updateCellString(this.cellList);
    this.mapRef.update(this.map)
      .then(success => {
        this.snackbar.open('Success!', '', {duration: 2000});
      })
      .catch(fail => {
        this.snackbar.open('Something went wrong', '', {duration: 2000});
      });
  }

  goBack(): void {
    this.location.back();
  }

  getCellColor(color: Color): string {
    const red = color.red.toString(16);
    const green = color.green.toString(16);
    const blue = color.blue.toString(16);
    return (red + green + blue);
  }
}
