import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {MonsterService} from '../../_services/monster.service';

@Component({
  selector: 'delete-pc',
  templateUrl: 'delete-monster.component.html',
})
export class DeleteMonsterComponent {
  constructor(
    public monsterService: MonsterService,
    public dialogRef: MatDialogRef<DeleteMonsterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  name: string;
  nameCheck: boolean;

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  checkName() {
    this.nameCheck = (this.name === this.data.name);
  }

  confirmDelete() {
    this.monsterService.deleteMonster(this.name)
      .then(pr => {
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.dialogRef.close(false);
      });
  }
}
