import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {CharacterService} from '../../_services/character.service';

@Component({
    selector: 'delete-pc',
    templateUrl: 'delete-character.component.html',
})
export class DeleteCharacterComponent {
    constructor(
        public characterService: CharacterService,
        public dialogRef: MdDialogRef<DeleteCharacterComponent>,
        @Inject(MD_DIALOG_DATA) public data: any
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
