import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CharacterService} from '../../_services/character.service';

@Component({
    selector: 'delete-pc',
    templateUrl: 'delete-character.component.html',
})
export class DeleteCharacterComponent {
    constructor(
        public characterService: CharacterService,
        public dialogRef: MatDialogRef<DeleteCharacterComponent>,
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
        this.characterService.deletePC(this.name)
          .then(pr => {
            this.dialogRef.close(true);
          })
          .catch(err => {
            this.dialogRef.close(false);
          });
    }
}
