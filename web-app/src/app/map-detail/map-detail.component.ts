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


  initMap(charData: GameMap): void {
    this.map = new GameMap(charData);
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


}
