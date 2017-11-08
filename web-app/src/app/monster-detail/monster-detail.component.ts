// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators} from '@angular/forms';
import 'rxjs/add/operator/switchMap';

// Authored
import {MonsterService} from '../_services/monster.service';
import {Monster} from '../_types/Monster';

// AngularFire2
import {AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'monster-detail',
  templateUrl: './monster-detail.component.html',
  styleUrls: ['./monster-detail.component.css'],
})
export class MonsterDetailComponent implements OnInit {
  constructor(
    private monsterService: MonsterService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar,
  ) {}
  monster: Monster;
  monsterRef: AngularFireObject<Monster>;
  monsterData: Observable<Monster>;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      this.monsterRef = this.monsterService.getMonsterRef(name);
      this.monsterData = this.monsterRef.valueChanges();
      this.monsterData.subscribe(monster => {
        this.initMonster(monster);
      });
    });
  }


  initMonster(monsterData: Monster): void {
    this.monster = new Monster(monsterData);
  }

  saveMonster(): void {
    this.monsterRef.update(this.monster)
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
