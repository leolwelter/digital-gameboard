// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Authored assets
import { Monster } from '../_types/Monster';
import { MonsterService } from '../_services/monster.service';
import { NewMonsterComponent } from './new-monster/new-monster.component';
import { DeleteMonsterComponent } from './delete-monster/delete-monster.component';

@Component({
  selector: 'monster-list',
  templateUrl: './monster-list.component.html',
  styleUrls: ['./monster-list.component.css'],
})
export class MonsterListComponent implements OnInit {
  constructor(
    private monsterService: MonsterService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  currentMonster: Monster;
  myMonsters: any;

  onSelect(monster: Monster): void {
    if (this.currentMonster !== monster) {
      this.currentMonster = monster;
    } else {
      this.currentMonster = null;
    }
  }
  ngOnInit(): void {
    if (!this.myMonsters) {
      this.getMonsters();
    }
  }
  getMonsters(): void {
    this.myMonsters = this.monsterService.getMonsterObservableList();
  }
  gotoDetail(): void {
    this.router.navigate(['/myMonsters', this.currentMonster.name]);
  }
  createMonster(): void {
    // Open dialog for name
    const dRef = this.dialog.open(NewMonsterComponent, { width: '37rem'});
    // navigate to new monster sheet
    dRef.afterClosed().subscribe(name => {
      if (name && name !== '') {
        this.router.navigate(['/myMonsters', name]);
      }
    });
  }
  deleteMonster(): void {
    // Open dialog for confirmation
    const dRef = this.dialog.open(DeleteMonsterComponent, { width: '37rem', data: { name: this.currentMonster.name }});
    dRef.afterClosed().subscribe( confirm => {
      if (confirm) {
        this.currentMonster = null;
      }
    });
  }
}
