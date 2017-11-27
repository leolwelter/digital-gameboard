import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { MonsterService } from '../../_services/monster.service';
import {Monster} from '../../_types/Monster';

@Component({
  selector: 'new-monster',
  templateUrl: 'new-monster.component.html',
})
export class NewMonsterComponent {
  constructor(
    private monsterService: MonsterService,
    public dialogRef: MatDialogRef<NewMonsterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  name: string;

  onNoClick(): void {
    this.dialogRef.close(false);
  }


  createMonster() {
    const monster = new Monster({
      'name': this.name,
      'isMonster': 'True'
    });
    this.monsterService.createMonster(monster)
      .then(pr => {
        this.dialogRef.close(monster.name);
      })
      .catch(err => {
        this.dialogRef.close(false);
      });
  }
}
