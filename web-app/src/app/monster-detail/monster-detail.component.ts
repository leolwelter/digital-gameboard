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
    private snackbar: MatSnackBar
) {}
  monster: Monster;
  monsterRef: AngularFireObject<Monster>;
  monsterData: Observable<Monster>;
  alignments: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      this.monsterRef = this.monsterService.getMonsterRef(name);
      this.monsterData = this.monsterRef.valueChanges();
      this.monsterData.subscribe(monster => {
        this.initMonster(monster);
      });
    });
    this.alignments = [
      {selector: 'Lawful Good',
        val: 'Lawful Good' },
      {selector: 'Neutral Good',
        val: 'Neutral Good' },
      {selector: 'Chaotic Good',
        val: 'Chaotic Good' },
      {selector: 'Lawful Neutral',
        val: 'Lawful Neutral' },
      {selector: 'True Neutral',
        val: 'True Neutral' },
      {selector: 'Chaotic Neutral',
        val: 'Chaotic Neutral' },
      {selector: 'Lawful Evil',
        val: 'Lawful Evil' },
      {selector: 'Neutral Evil',
        val: 'Neutral Evil' },
      {selector: 'Chaotic Evil',
        val: 'Chaotic Evil' }
    ];
  }


  initMonster(monsterData: Monster): void {
    this.monster = new Monster(monsterData);
  }

  recalcAbs(absIndex: number): void {
    this.monster.absMods[absIndex] = Math.floor((this.monster.abilities[absIndex] - 10) / 2);
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
