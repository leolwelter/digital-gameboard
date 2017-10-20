import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { CharacterService } from '../../_services/character.service';
import {Character} from '../../_types/Character';

@Component({
    selector: 'new-pc',
    templateUrl: 'new-pc.component.html',
})
export class NewCharacterComponent {
    constructor(
        private characterService: CharacterService,
        public dialogRef: MatDialogRef<NewCharacterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    name: string;

    onNoClick(): void {
        this.dialogRef.close(false);
    }


    createCharacter() {
      const pc = new Character({ 'name': this.name});
      this.characterService.createPC(pc)
        .then(pr => {
          this.dialogRef.close(pc.name);
        })
        .catch(err => {
          this.dialogRef.close(false);
        });
    }
}
