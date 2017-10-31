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
import {AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';
import {Cell} from '../_types/Cell';
import {Color} from '../_types/Color';


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
  stats: string[]; // init later?
  columns: number;
  mapRef: AngularFireObject<GameMap>;
  mapData: Observable<GameMap>;
  cellList: Observable<any[]>;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      this.mapRef = this.mapService.getMapRef(name);
      this.mapData = this.mapRef.valueChanges();
      this.columns = 0;
      this.mapData.subscribe(rData => {
        this.initMap(rData);
      });
    });
  }


  initMap(mapData: GameMap): void {
    this.map = new GameMap(mapData);
    this.columns = this.map.sizeX;
    this.cellList = this.mapService.getCellsObservableList(this.map.name);
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

  goBack(): void {
    this.location.back();
  }

  getCellColor(color: Color): string {
    const scale = 3;
    const red = (color.red * scale).toString(16);
    const green = (color.green * scale).toString(16);
    const blue = (color.blue * scale).toString(16);
    return ('#' + red + green + blue);
  }
}
